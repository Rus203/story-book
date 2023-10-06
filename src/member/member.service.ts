import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { User } from 'src/user/user.schema';
import { GENDER } from 'src/enums';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { Member } from './member.schema';

@Injectable()
export class MemberService {
  constructor(private memberRepository: MemberRepository) {}

  async createGroup(postId: string, owner: User) {
    await this.memberRepository.create({
      postId,
      participants: [owner._id.toString()],

      currentWomenCount: owner.gender.value === GENDER.WOMAN ? 1 : 0,
      currentMenCount: owner.gender.value === GENDER.MAN ? 1 : 0,
      currentOthersCount: owner.gender.value === GENDER.OTHER ? 1 : 0,

      currentGuestWomenCount: 0,
      currentGuestMenCount: 0,
      currentGuestOthersCount: 0,
    });
  }

  async findOneGroupByParams(filterQuery: FilterQuery<Member>) {
    return this.memberRepository.findOne(filterQuery);
  }

  async findGroupsByParams(filterQuery: FilterQuery<Member>) {
    return this.memberRepository.findOne(filterQuery);
  }

  async updateGroupByParams(
    filterQuery: FilterQuery<Member>,
    updatedEntityData: UpdateQuery<Member>
  ) {
    return this.memberRepository.findOneAndUpdate(
      filterQuery,
      updatedEntityData
    );
  }
}
