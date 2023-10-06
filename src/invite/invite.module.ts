import { Module } from '@nestjs/common';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { DataBaseModule } from 'src/database';
import { MongooseModule } from '@nestjs/mongoose';
import { Invite, InviteSchema } from './invite.schema';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';
import { InviteRepository } from './invite.repository';

@Module({
  controllers: [InviteController],
  providers: [InviteService, InviteRepository],
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: Invite.name, schema: InviteSchema }]),
    UserModule,
    PostModule,
  ],
})
export class InviteModule {}
