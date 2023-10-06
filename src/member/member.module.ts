import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { DataBaseModule } from 'src/database';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './member.schema';
import { MemberRepository } from './member.repository';

@Module({
  providers: [MemberService, MemberRepository],
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  exports: [MemberService],
  controllers: [],
})
export class MemberModule {}
