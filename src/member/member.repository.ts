import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Member } from './member.schema';

@Injectable()
export class MemberRepository extends AbstractRepository<Member> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(Member.name) MemberModel: Model<Member>,
    @InjectConnection() connection: Connection
  ) {
    super(MemberModel, connection);
  }
}
