import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { promisify } from 'util';
import { recordFile } from 'src/utils';
import { FilterQuery } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Image } from './image.schema';

const asyncUnlink = promisify(fs.unlink);

interface IImage {
  ownerId?: string;
  placeId?: string;
  packageId?: string;
}

@Injectable()
export class ImageService {
  constructor(
    private imageRepository: ImageRepository,
    private configService: ConfigService
  ) {}

  async addImage(file: Express.Multer.File, parameters: IImage) {
    const publicFolder = this.configService.get<string>('PUBLIC_FOLDER');

    const { imageName, fullImagePath } = await recordFile(file, publicFolder);

    const currentImage = { imagePath: imageName };

    try {
      return await this.imageRepository.create({
        ...currentImage,
        ...parameters,
      });
    } catch (error) {
      asyncUnlink(fullImagePath);
    }
  }

  async getImagesByParams(filterQuery: FilterQuery<Image>) {
    const expect = {
      isActive: false,
      ownerId: false,
      packageId: false,
      placeId: false,
    };
    return this.imageRepository.find(filterQuery, expect);
  }

  async getOneImageByParams(filterQuery: FilterQuery<Image>) {
    const expect = {
      isActive: false,
      ownerId: false,
    };
    return this.imageRepository.findOne(filterQuery, expect);
  }

  async softDeleteImage(imageId: string, user: User) {
    await this.imageRepository.findOneAndUpdate(
      { _id: imageId, ownerId: user._id },
      { isActive: false }
    );
  }
}
