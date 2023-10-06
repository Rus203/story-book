import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestRepository } from './request.repository';
import { GENDER, REQUEST_STATUS } from 'src/enums';
import { FilterQuery } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { MemberService } from 'src/member/member.service';
import { User } from 'src/user/user.schema';

@Injectable()
export class RequestService {
  constructor(
    private requestRepository: RequestRepository,
    private postService: PostService,
    private userService: UserService,
    private memberService: MemberService
  ) {}

  async addRequest(postId: string, userId: string) {
    const { guestMenCount, guestWomenCount, guestOthersCount } =
      await this.postService.getOnePostByParams({ _id: postId });

    const user = await this.userService.getOneUserByParams({ _id: userId });

    const requests = await this.requestRepository.find({ postId, userId });

    if (requests.length > 0) {
      return;
    }

    const {
      currentGuestMenCount,
      currentGuestOthersCount,
      currentGuestWomenCount,
    } = await this.memberService.findOneGroupByParams({ postId });

    switch (user.gender?.value) {
      case GENDER.MAN:
        if (currentGuestMenCount + 1 > guestMenCount) {
          throw new ConflictException('Max number of men has been reached');
        }

        return this.requestRepository.create({
          userId,
          postId,
          requestStatus: REQUEST_STATUS.NEW,
        });

      case GENDER.WOMAN:
        if (currentGuestWomenCount + 1 > guestWomenCount) {
          throw new ConflictException('Max number of women has been reached');
        }

        return this.requestRepository.create({
          userId,
          postId,
          requestStatus: REQUEST_STATUS.NEW,
        });

      case GENDER.OTHER:
        if (currentGuestOthersCount + 1 > guestOthersCount) {
          throw new ConflictException('Max number of others has been reached');
        }

        return this.requestRepository.create({
          userId,
          postId,
          requestStatus: REQUEST_STATUS.NEW,
        });

      default:
        throw new ConflictException('Gender has not been set yet');
    }
  }

  async getRequestsByParams(filterQuery: FilterQuery<Request>) {
    const requests = await this.requestRepository.find(filterQuery);

    return Promise.all(
      requests.map(async (request) => {
        const { userId, ...data } = request;
        const user = await this.userService.getOneUserByParams(
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
        );
        return { ...data, user };
      })
    );
  }

  async getOneRequestByParams(filterQuery: FilterQuery<Request>) {
    const { userId, ...data } =
      await this.requestRepository.findOne(filterQuery);

    const user = await this.userService.getOneUserByParams(
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
    );

    return { ...data, user };
  }

  async takeDecisionRequest(
    requestId: string,
    postId: string,
    decision: REQUEST_STATUS,
    owner: User
  ) {
    console.log(1);

    const { guestMenCount, guestWomenCount, guestOthersCount } =
      await this.postService.getOnePostByParams({
        _id: postId,
        ownerId: owner._id,
      });

    console.log(2);

    const request = await this.requestRepository.findOne({
      postId,
      _id: requestId,
    });

    console.log(3);

    const user = await this.userService.getOneUserByParams({
      _id: request.userId,
    });

    console.log(4);

    const {
      participants,
      _id,
      currentGuestMenCount,
      currentGuestOthersCount,
      currentGuestWomenCount,
    } = await this.memberService.findOneGroupByParams({ postId });

    console.log(5);

    if (request.requestStatus !== REQUEST_STATUS.NEW) {
      throw new ForbiddenException('Forbidden');
    }

    if (participants.includes(request.userId)) {
      return;
    }

    if (decision === REQUEST_STATUS.APPROVE) {
      switch (user.gender?.value) {
        case GENDER.MAN:
          if (currentGuestMenCount + 1 > guestMenCount) {
            throw new ConflictException('Max number of men has been reached');
          }

          await this.requestRepository.findOneAndUpdate(
            { _id: requestId },
            { requestStatus: decision }
          );

          await this.memberService.updateGroupByParams(
            { _id },
            {
              participants: [...participants, user._id.toString()],
              currentGuestMenCount: currentGuestMenCount + 1,
            }
          );
          break;

        case GENDER.WOMAN:
          if (currentGuestWomenCount + 1 > guestWomenCount) {
            throw new ConflictException('Max number of women has been reached');
          }

          await this.requestRepository.findOneAndUpdate(
            { _id: requestId },
            { requestStatus: decision }
          );

          await this.memberService.updateGroupByParams(
            { _id },
            {
              participants: [...participants, user._id.toString()],
              currentGuestWomenCount: currentGuestWomenCount + 1,
            }
          );
          break;

        case GENDER.OTHER:
          if (currentGuestOthersCount + 1 > guestOthersCount) {
            throw new ConflictException(
              'Max number of others has been reached'
            );
          }

          await this.requestRepository.findOneAndUpdate(
            { _id: requestId },
            { requestStatus: decision }
          );

          await this.memberService.updateGroupByParams(
            { _id },
            {
              participants: [...participants, user._id.toString()],
              currentGuestOthersCount: currentGuestOthersCount + 1,
            }
          );
          break;

        default:
          throw new ConflictException('Gender has not been set yet');
      }
    } else if (decision === REQUEST_STATUS.REJECTED) {
      await this.requestRepository.findOneAndUpdate(
        { _id },
        { requestStatus: decision }
      );
    }
  }
}
