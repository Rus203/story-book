import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PackageRepository } from './package.repository';
import { ConfigService } from '@nestjs/config';
import { PlaceService } from 'src/place/place.service';
import { FilterQuery } from 'mongoose';
import { Package } from './package.scheme';
import { User } from 'src/user/user.schema';
import { ImageService } from 'src/image/image.service';
import { UserService } from 'src/user/user.service';

interface IPackage {
  name: string;
  tags: string[];
  description: string;
  date: string;
  minSpend: number;
  maxPeople: number;
  placeId: string;
}

@Injectable()
export class PackageService {
  constructor(
    private packageRepository: PackageRepository,
    private configService: ConfigService,
    private placeService: PlaceService,
    private imageService: ImageService,
    private userService: UserService
  ) {}

  async getOnePackageByParams(filterQuery: FilterQuery<Package>) {
    const { ownerId, avatarId, ...data } =
      await this.packageRepository.findOne(filterQuery);

    const images = await this.imageService.getImagesByParams({
      packageId: data._id,
    });

    const owner = await this.userService.getOneUserByParams(
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
      }
    );

    const avatar = images.reduce((acc, item) => {
      if (item._id?.toString() === avatarId?.toString()) {
        acc = item;
      }

      return acc;
    }, undefined);

    return { ...data, owner, images, avatar };
  }

  async getPackagesByParams(entityFilterQuery: FilterQuery<Package>) {
    let tags: undefined | object;
    let maxPeople: undefined | object;
    let minSpend: undefined | object;

    if (entityFilterQuery.tags) {
      tags = { tags: { $all: entityFilterQuery?.tags } };
    }

    if (entityFilterQuery.maxPeople) {
      maxPeople = { maxPeople: { $gte: entityFilterQuery.maxPeople } };
    }

    if (entityFilterQuery.minSpend) {
      minSpend = { minSpend: { $gte: entityFilterQuery.minSpend } };
    }

    const packages = await this.packageRepository.find({
      ...entityFilterQuery,
      ...tags,
      ...maxPeople,
      ...minSpend,
    });

    return Promise.all(
      packages.map(async (pack) => {
        const { ownerId, ...data } = pack;

        const owner = await this.userService.getOneUserByParams(
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
          }
        );

        const images = await this.imageService.getImagesByParams({
          packageId: pack._id,
        });

        const avatar = images.reduce((acc, item) => {
          if (item._id?.toString() === pack.avatarId?.toString()) {
            acc = item;
          }

          return acc;
        }, undefined);

        delete data.avatarId;

        return { ...data, owner, images, avatar };
      })
    );
  }

  async softDeletePackage(_id: string, owner: User) {
    return this.packageRepository.findOneAndUpdate(
      { _id, ownerId: owner._id },
      { isActive: false }
    );
  }

  async updatePackage() {
    throw new InternalServerErrorException('Not implement yet');
  }

  async addPackage(data: IPackage, owner: User) {
    const { tags, placeId } = data;
    const place = await this.placeService.getOnePlaceByParams({
      _id: placeId,
      ownerId: owner._id,
    });

    for (const element of tags) {
      if (!place.tags.includes(element)) {
        throw new BadRequestException(`Invalid tag - ${element}`);
      }
    }

    return this.packageRepository.create({
      ...data,
      ownerId: owner._id,
    });
  }

  async addImagePackage(
    packageId: string,
    file: Express.Multer.File,
    user: User
  ) {
    const images = await this.imageService.getImagesByParams({
      ownerId: user._id,
      packageId,
    });

    const newImage = await this.imageService.addImage(file, {
      packageId,
    });

    if (images.length === 0) {
      await this.packageRepository.findOneAndUpdate(
        { _id: packageId },
        { avatarId: newImage._id }
      );
    }
  }

  async softDeleteImagePackage(packageId: string, imageId: string, user: User) {
    await this.imageService.getOneImageByParams({ _id: imageId, packageId });

    await this.imageService.softDeleteImage(imageId, user);
  }

  async setPackageAvatar(packageId: string, imageId: string, user: User) {
    await this.imageService.getOneImageByParams({ _id: imageId, packageId });

    await this.packageRepository.findOneAndUpdate(
      { _id: packageId, ownerId: user._id },
      { avatarId: imageId }
    );
  }
}
