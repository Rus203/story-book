import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { FilterQuery } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ImageService } from 'src/image/image.service';
import { User } from './user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
    private imageService: ImageService
  ) {}

  async addUser(phoneNumber: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.create({
      phoneNumber,
      password: hashedPassword,
      phoneVerified: false,
    });
  }

  async getUsersByParams(
    filterQuery?: FilterQuery<User>,
    projection?: Record<string, unknown>,
    needImg = false
  ) {
    const excepted = {
      password: false,
      refreshToken: false,
      ...projection,
    };

    const users = await this.userRepository.find(filterQuery, excepted);

    return Promise.all(
      users.map(async (user) => {
        const { avatarId, ...data } = user;
        const avatar = await this.imageService.getImagesByParams({
          ownerId: data._id,
          _id: avatarId,
        });

        let images = undefined;

        if (needImg) {
          images = await this.imageService.getImagesByParams({
            ownerId: data._id,
          });
        }

        return { ...data, avatar: avatar[0], images };
      })
    );
  }

  async getOneUserByParams(
    filterQuery: Partial<User>,
    projection?: Record<string, unknown>,
    needImg = false
  ) {
    const excepted = {
      ...projection,
      password: false,
      refreshToken: false,
    };

    const user = await this.userRepository.findOne(filterQuery, excepted);

    const { avatarId, ...data } = user;

    const avatar = await this.imageService.getImagesByParams({
      ownerId: data._id,
      _id: avatarId,
    });

    let images = undefined;
    if (needImg) {
      images = await this.imageService.getImagesByParams({
        ownerId: data._id,
      });
    }

    return { ...data, avatar: avatar[0], images };
  }

  async getAllUsersByParams(
    filterQuery: Partial<User>,
    projection?: Record<string, unknown>
  ) {
    const users = await this.userRepository.findAll(filterQuery, projection);

    return Promise.all(
      users.map(async (user) => {
        const { avatarId, ...data } = user;
        const avatar = await this.imageService.getImagesByParams({
          ownerId: data._id,
          _id: avatarId,
        });

        return { ...data, avatar: avatar[0] };
      })
    );
  }

  async softDeleteUser(_id: string) {
    return this.userRepository.upsert({ _id }, { isActive: false });
  }

  async recordField(
    filterQuery: FilterQuery<User>,
    updatedEntityData: Record<string, any>
  ) {
    return this.userRepository.findOneAndUpdate(filterQuery, updatedEntityData);
  }

  async addImage(file: Express.Multer.File, user: User) {
    const images = await this.imageService.getImagesByParams({
      ownerId: user._id,
    });

    const newImage = await this.imageService.addImage(file, {
      ownerId: user._id,
    });

    if (images.length === 0) {
      await this.userRepository.findOneAndUpdate(
        { _id: user._id },
        { avatarId: newImage._id }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isActive, ...data } = newImage;
    return data;
  }

  async setAvatar(imageId: string, user: User) {
    await this.imageService.getOneImageByParams({
      _id: imageId,
      ownerId: user._id,
    });

    await this.userRepository.findOneAndUpdate(
      { _id: user._id },
      { avatarId: imageId }
    );
  }

  async deleteImage(imageId: string, user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isActive, ...data } = await this.imageService.softDeleteImage(
      imageId,
      user
    );
    return data;
  }
}
