import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CurrentUser } from 'src/auth/decorators';
import { MongoIdDto } from 'src/dto';
import { TakeDecisionDto } from './dto';
import { User } from 'src/user/user.schema';
import { CreateRequestDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('request')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get('/')
  async getRequests(@Query() data: Partial<Request>) {
    return this.requestService.getRequestsByParams(data);
  }

  @Post('/')
  async addRequest(@Body() body: CreateRequestDto, @CurrentUser() user: User) {
    return this.requestService.addRequest(body.postId, user._id);
  }

  @Get(':_id')
  async getRequest(@Param() data: MongoIdDto) {
    return this.requestService.getOneRequestByParams({ _id: data._id });
  }

  @Patch(':_id')
  async takeDecision(
    @Param() data: MongoIdDto,
    @Body() body: TakeDecisionDto,
    @CurrentUser() owner: User
  ) {
    const { decision, postId } = body;
    await this.requestService.takeDecisionRequest(
      data._id,
      postId,
      decision,
      owner
    );
  }
}
