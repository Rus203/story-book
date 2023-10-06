import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { DataBaseModule } from 'src/database';
import { MongooseModule } from '@nestjs/mongoose';
import { PostRepository } from './post.repository';
import { Post, PostSchema } from './post.schema';
import { UserModule } from 'src/user/user.module';
import { PackageModule } from 'src/package/package.module';
import { ImageModule } from 'src/image/image.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    DataBaseModule,
    UserModule,
    PackageModule,
    ImageModule,
    PostModule,
    MemberModule,
  ],
  exports: [PostService],
})
export class PostModule {}
