import { BadRequestException, Injectable } from '@nestjs/common';
import { InviteRepository } from './invite.repository';
import { INVITE_STATUS, HOST_TYPE } from 'src/enums';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/user.schema';
import { FilterQuery } from 'mongoose';
import { Invite } from './invite.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InviteService {
  constructor(
    private inviteRepository: InviteRepository,
    private postService: PostService,
    private userService: UserService
  ) {}

  async addInvite(postId: string, userId: string, owner: User) {
    const post = await this.postService.getOnePostByParams({ _id: postId });
    const user = await this.userService.getOneUserByParams({ _id: userId });
    if (
      post.hostType === HOST_TYPE.HOST ||
      post.owner._id.toString() !== owner._id.toString() ||
      !post.gender.includes(user.gender.value)
    ) {
      throw new BadRequestException('Forbidden');
    }

    await this.inviteRepository.create({
      postId,
      userId,
      inviteStatus: INVITE_STATUS.NEW,
    });
  }

  async getOneInviteByParams(filterQuery: FilterQuery<Invite>) {
    return this.inviteRepository.findOne(filterQuery);
  }

  async getInvitesByParams(filterQuery: FilterQuery<Invite>) {
    return this.inviteRepository.find(filterQuery);
  }

  async confirmOrReject(_id: string, decision: INVITE_STATUS, user: User) {
    const invite = await this.inviteRepository.findOne({ _id });

    if (
      invite.userId.toString() !== user._id.toString() ||
      invite.inviteStatus !== INVITE_STATUS.NEW
    ) {
      throw new BadRequestException('Forbidden');
    }

    if (decision === INVITE_STATUS.APPROVE) {
      await this.postService.updatePost(
        { _id: invite.postId },
        { hostType: HOST_TYPE.HOST, ownerId: invite.userId }
      );
    }

    await this.inviteRepository.findOneAndUpdate(
      { _id },
      { inviteStatus: decision }
    );
  }

  async softDeleteInvite(_id: string, user: User) {
    const invite = await this.inviteRepository.findOne({ _id });

    const post = await this.postService.getOnePostByParams({
      _id: invite.postId,
    });

    if (
      post.owner._id.toString() !== user._id.toString() ||
      invite.inviteStatus !== INVITE_STATUS.NEW
    ) {
      throw new BadRequestException('Forbidder');
    }

    return this.inviteRepository.findOneAndUpdate({ _id }, { isActive: false });
  }
}
