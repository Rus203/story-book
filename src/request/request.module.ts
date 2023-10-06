import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { DataBaseModule } from 'src/database';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './request.schema';
import { RequestRepository } from './request.repository';
import { RequestController } from './request.controller';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  providers: [RequestService, RequestRepository],
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    PostModule,
    UserModule,
    MemberModule,
  ],
  exports: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
