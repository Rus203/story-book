import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { FilterQuery } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Post } from './post.schema';
import { GENDER, POST_STATUS } from 'src/enums';
import { HOST_TYPE } from 'src/enums/host-type.enum';
import { User } from 'src/user/user.schema';
import { PackageService } from 'src/package/package.service';
import { ImageService } from 'src/image/image.service';
import { MemberService } from 'src/member/member.service';

interface IPost {
  name: string;
  date: string;
  location: string;
  tags: string[];
  venue: string;
  menCount: number;
  womenCount: number;
  othersCount: number;
  guestMenCount: number;
  guestWomenCount: number;
  guestOthersCount: number;
  packageId: string;
  description: string;
  hostType: HOST_TYPE;
  gender: GENDER[];
}

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private userService: UserService,
    private packageService: PackageService,
    private imageService: ImageService,
    private memberService: MemberService
  ) {}

  async getOnePostByParams(filterQuery: FilterQuery<Post>) {
    const { ownerId, ...data } = await this.postRepository.findOne(filterQuery);

    const owner = await this.userService.getOneUserByParams(
      { _id: ownerId },
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

    const packageImages = await this.imageService.getImagesByParams({
      packageId: data.packageId,
    });

    const { participants } = await this.memberService.findOneGroupByParams({
      postId: data._id,
    });

    const members = await Promise.all(
      participants.map((userId) =>
        this.userService.getOneUserByParams(
          { _id: userId },
          {
            gender: false,
            sexualOrientation: false,
            shownGender: false,
            phoneVerified: false,
            birthDate: false,
            phoneNumber: false,
            email: false,
          }
        )
      )
    );

    return { ...data, members, owner, images: packageImages };
  }

  async getPostsByParams(entityFilterQuery: FilterQuery<Post>) {
    const expected = { isActive: false };

    let tags = undefined;
    if (entityFilterQuery.tags) {
      tags = { tags: { $all: entityFilterQuery?.tags } };
    }

    const posts = await this.postRepository.find(
      { ...entityFilterQuery, ...tags },
      expected
    );

    return Promise.all(
      posts.map(async (post) => {
        const { ownerId, ...data } = post;

        const { participants } = await this.memberService.findOneGroupByParams({
          postId: data._id,
        });

        const members = await Promise.all(
          participants.map((userId) =>
            this.userService.getOneUserByParams(
              { _id: userId },
              {
                gender: false,
                sexualOrientation: false,
                shownGender: false,
                phoneVerified: false,
                birthDate: false,
                phoneNumber: false,
                email: false,
              }
            )
          )
        );

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
          packageId: data.packageId,
        });

        return { ...data, owner, images, members };
      })
    );
  }

  async softDeletePost(_id: string, owner: User) {
    const post = await this.postRepository.findOne({ _id });

    if (post.postStatus !== POST_STATUS.NEW) {
      throw new ConflictException('Forbidden deleting');
    }

    return this.postRepository.findOneAndUpdate(
      { _id, ownerId: owner._id },
      { isActive: false }
    );
  }

  async updateStatusPost(_id: string, postStatus: POST_STATUS) {
    const post = await this.postRepository.findOne({ _id });

    if (
      (post.postStatus === POST_STATUS.NEW &&
        postStatus !== POST_STATUS.COMPLETE) ||
      (post.postStatus === POST_STATUS.ACTIVE &&
        postStatus === POST_STATUS.COMPLETE)
    ) {
      return this.postRepository.findOneAndUpdate({ _id }, { postStatus });
    }

    throw new ConflictException('Forbidden');
  }

  async updatePost(
    filterQuery: FilterQuery<Post>,
    updatedEntityData: Partial<Post>
  ) {
    return this.postRepository.findOneAndUpdate(filterQuery, updatedEntityData);
  }

  async addPost(data: IPost, owner: User) {
    const {
      menCount,
      womenCount,
      othersCount,
      guestMenCount,
      guestWomenCount,
      guestOthersCount,
    } = data;
    const { tags, maxPeople } = await this.packageService.getOnePackageByParams(
      {
        _id: data.packageId,
      }
    );

    const commonCount =
      menCount +
      womenCount +
      othersCount +
      guestMenCount +
      guestWomenCount +
      guestOthersCount;

    if (commonCount > maxPeople) {
      throw new BadRequestException(
        'Max number of participants has been reached'
      );
    }

    if (!owner.gender) {
      throw new BadRequestException('Gender have not been set yet');
    }

    const post = await this.postRepository.create({
      ...data,
      postStatus: POST_STATUS.NEW,
      tags,
      ownerId: owner._id,
    });

    await this.memberService.createGroup(post._id, owner);
  }

  async addParticipant(postId: string, userId: string, owner: User) {
    const { menCount, womenCount, othersCount } =
      await this.postRepository.findOne({
        _id: postId,
        ownerId: owner._id,
      });

    const user = await this.userService.getOneUserByParams({ _id: userId });

    const {
      participants,
      _id,
      currentMenCount,
      currentOthersCount,
      currentWomenCount,
    } = await this.memberService.findOneGroupByParams({ postId });

    if (participants.includes(userId)) {
      return;
    }

    switch (user.gender?.value) {
      case GENDER.MAN:
        if (currentMenCount + 1 > menCount) {
          throw new ConflictException('Max number of men has been reached');
        }
        await this.memberService.updateGroupByParams(
          { _id },
          {
            participants: [...participants, userId],
            currentMenCount: currentMenCount + 1,
          }
        );
        break;

      case GENDER.WOMAN:
        if (currentWomenCount + 1 > womenCount) {
          throw new ConflictException('Max number of women has been reached');
        }
        await this.memberService.updateGroupByParams(
          { _id },
          {
            participants: [...participants, userId],
            currentWomenCount: currentWomenCount + 1,
          }
        );
        break;

      case GENDER.OTHER:
        if (currentOthersCount + 1 > othersCount) {
          throw new ConflictException('Max number of others has been reached');
        }
        await this.memberService.updateGroupByParams(
          { _id },
          {
            participants: [...participants, userId],
            currentOthersCount: currentOthersCount + 1,
          }
        );
        break;

      default:
        throw new ConflictException('Gender has not been set yet');
    }
  }

  async getParticipant(postId: string) {
    const { participants } = await this.memberService.findOneGroupByParams({
      postId,
    });

    return Promise.all(
      participants.map(async (userId) => {
        const user = await this.userService.getOneUserByParams(
          { _id: userId },
          {
            phoneVerified: false,
            phoneNumber: false,
            gender: false,
            sexualOrientation: false,
            shownGender: false,
          }
        );

        return user;
      })
    );
  }
}
