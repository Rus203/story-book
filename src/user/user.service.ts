import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { FilterQuery, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { User } from './user.schema';

const asyncWriteFile = promisify(fs.writeFile);
const asyncUnlink = promisify(fs.unlink);

const base64Regex = /^data:image\/\w+;base64,/;
const dataURLRegex = /^data:image\/(jpeg|jpg|png);base64,/;

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService
  ) {}

  async addUser(phoneNumber: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.create({
      phoneNumber,
      password: hashedPassword,
      phoneVerified: false,
    });
  }

  async getUsers(filterQuery?: FilterQuery<User>) {
    const excepted = {
      isActive: 0,
      password: 0,
      refreshToken: 0,

      images: { $elemMatch: { isActive: false } },
    };
    const users = await this.userRepository.find(
      { ...filterQuery, isActive: true },
      excepted
    );

    return users?.map((user) => {
      const { images, ...data } = user;
      const filteredMetaData = images?.map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isActive, ...other } = item;
        return other;
      });

      return { ...data, images: filteredMetaData };
    });
  }

  async getOneUserByParams(filterQuery: Partial<User>) {
    const excepted = {
      isActive: 0,
      password: 0,
      refreshToken: 0,
      images: { $elemMatch: { isActive: false } },
    };
    const user = await this.userRepository.findOne(filterQuery, excepted);

    const { images, ...data } = user;

    const filteredMetaData = images?.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isActive, ...other } = item;
      return other;
    });

    return { ...data, images: filteredMetaData };
  }

  async getOneUserByParamsWithPassword(filterQuery: Partial<User>) {
    const excepted = { isActive: 0 };
    return this.userRepository.findOne(filterQuery, excepted);
  }

  async softDelete(_id: string) {
    return this.userRepository.upsert({ _id }, { isActive: false });
  }

  async recordField(
    filterQuery: FilterQuery<User>,
    updatedEntityData: Record<string, any>
  ) {
    return this.userRepository.findOneAndUpdate(filterQuery, updatedEntityData);
  }

  async addImage(imageData: string, user: User) {
    const formatMatch = imageData.match(dataURLRegex);

    if (!formatMatch) {
      throw new BadRequestException('Invalid formats of file');
    }

    const publicFolder = this.configService.get<string>('PUBLIC_FOLDER');
    const buffer = Buffer.from(imageData.replace(base64Regex, ''), 'base64');
    const folderName = path.join(__dirname, '..', '..', publicFolder);
    const imageName = `${new Types.ObjectId()}.${formatMatch[1]}`;
    const fullImagePath = path.join(folderName, imageName);

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }

    await asyncWriteFile(fullImagePath, buffer);

    const currentImage = {
      imagePath: imageName,
      isActive: true,
      isAvatar: user.images === undefined,
    };

    const images = user.images
      ? [...user.images, currentImage]
      : [currentImage];

    try {
      await this.userRepository.findOneAndUpdate({ _id: user._id }, { images });
    } catch (error) {
      asyncUnlink(fullImagePath);

      throw new InternalServerErrorException(error.message);
    }
  }

  async setAvatar(imageName: string, user: User) {
    const images = user.images?.map((item) => {
      if (item.imagePath === imageName) {
        item.isAvatar = true;
      } else {
        item.isAvatar = false;
      }

      return item;
    });

    await this.userRepository.findOneAndUpdate({ _id: user._id }, { images });
  }

  async softDeleteImage(imageName: string, user: User) {
    const images = user.images?.map((item) => {
      if (item.imagePath === imageName) {
        item.isActive = false;
      }

      return item;
    });

    await this.userRepository.findOneAndUpdate({ _id: user._id }, { images });
  }
}
