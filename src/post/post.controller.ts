import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CurrentUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { MongoIdDto } from 'src/dto';
import { ChangePostStatus, CreatePostDto, UserIdDto } from './dto';
import { Post as PostSchema } from './post.schema';
import { User } from 'src/user/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/')
  async getPosts(@Query() data: Partial<PostSchema>) {
    return this.postService.getPostsByParams(data);
  }

  @Post('/')
  async addPost(@Body() body: CreatePostDto, @CurrentUser() owner: User) {
    await this.postService.addPost(body, owner);
  }

  @Get(':_id')
  async getPost(@Param() data: MongoIdDto) {
    return this.postService.getOnePostByParams({ _id: data._id });
  }

  @Delete(':_id')
  async deletePost(@Param() data: MongoIdDto, @CurrentUser() owner: User) {
    await this.postService.softDeletePost(data._id, owner);
  }

  @Patch(':_id/set-status')
  async updatePostStatus(
    @Param() data: MongoIdDto,
    @Body() body: ChangePostStatus
  ) {
    await this.postService.updateStatusPost(data._id, body.postStatus);
  }

  @Patch(':_id/add-participant')
  async addParticipant(
    @Param() data: MongoIdDto,
    @Body() body: UserIdDto,
    @CurrentUser() owner: User
  ) {
    await this.postService.addParticipant(data._id, body.userId, owner);
  }

  @Get(':_id/get-participant')
  async getParticipant(@Param() data: MongoIdDto) {
    return this.postService.getParticipant(data._id);
  }
}
