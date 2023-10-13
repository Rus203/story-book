import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { FilterQuery } from 'mongoose';
import { Place } from './place.schema';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';
import { ImageService } from 'src/image/image.service';

interface IPlace {
  name: string;
  location: string;
  ownerId: string;
  tags: string[];
}

@Injectable()
export class PlaceService {
  constructor(
    private placeRepository: PlaceRepository,
    private configService: ConfigService,
    private userService: UserService,
    private imageService: ImageService
  ) {}

  async getOnePlaceByParams(filterQuery: FilterQuery<Place>) {
    const { ownerId, avatarId, ...data } =
      await this.placeRepository.findOne(filterQuery);

    const owner = await this.userService.getAllUsersByParams(
      {
        _id: ownerId,
      },
      {
        gender: false,
        sexualOrientation: false,
        shownGender: false,
        phoneVerified: false,
        birthDate: false,
        phoneNumber: false,
        email: false,
        password: false,
        refreshToken: false,
      }
    );

    const images = await this.imageService.getImagesByParams({
      placeId: data._id,
    });

    const avatar = images.reduce((acc, item) => {
      if (item._id?.toString() === avatarId?.toString()) {
        acc = item;
      }

      return acc;
    }, undefined);

    return { ...data, owner: owner[0], images, avatar };
  }

  async getPlacesByParams(entityFilterQuery: FilterQuery<Place>) {
    let tags = undefined;
    if (entityFilterQuery.tags) {
      tags = { tags: { $all: entityFilterQuery?.tags } };
    }

    const places = await this.placeRepository.find(
      { ...entityFilterQuery, ...tags },
      { isActive: false }
    );

    return Promise.all(
      places.map(async (place) => {
        const { ownerId, avatarId, ...data } = place;

        const owner = await this.userService.getAllUsersByParams(
          {
            _id: ownerId,
          },
          {
            gender: false,
            sexualOrientation: false,
            shownGender: false,
            phoneVerified: false,
            birthDate: false,
            phoneNumber: false,
            email: false,
            password: false,
            refreshToken: false,
          }
        );

        const images = await this.imageService.getImagesByParams({
          placeId: place._id,
        });

        const avatar = images.reduce((acc, item) => {
          if (item._id?.toString() === avatarId?.toString()) {
            acc = item;
          }

          return acc;
        }, undefined);

        return { ...data, owner: owner[0], images, avatar };
      })
    );
  }

  async softDeletePlace(_id: string, owner: User) {
    return this.placeRepository.findOneAndUpdate(
      { _id, ownerId: owner._id },
      { isActive: false }
    );
  }

  async updatePlace() {
    throw new InternalServerErrorException('Not implement yet');
  }

  async addPlace(data: IPlace) {
    return this.placeRepository.create(data);
  }

  async addImage(placeId: string, file: Express.Multer.File, user: User) {
    const images = await this.imageService.getImagesByParams({
      ownerId: user._id,
      placeId,
    });

    const newImage = await this.imageService.addImage(file, {
      placeId,
    });

    if (images.length === 0) {
      await this.placeRepository.findOneAndUpdate(
        { _id: placeId },
        { avatarId: newImage._id }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isActive, ...data } = newImage;
    return data;
  }

  async setAvatar(placeId: string, imageId: string, user: User) {
    await this.imageService.getOneImageByParams({
      _id: imageId,
      placeId,
    });

    await this.placeRepository.findOneAndUpdate(
      { _id: placeId, ownerId: user._id },
      { avatarId: imageId }
    );
  }

  async softDeleteImage(placeId: string, imageId: string, user: User) {
    await this.imageService.getOneImageByParams({
      _id: imageId,
      placeId,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isActive, ...data } = await this.imageService.softDeleteImage(
      imageId,
      user
    );
    return data;
  }
}
