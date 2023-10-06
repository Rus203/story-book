import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto, DecisionDto } from './dto';
import { CurrentUser } from 'src/auth/decorators';
import { User } from 'src/user/user.schema';
import { MongoIdDto } from 'src/dto';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('invite')
@UseGuards(JwtAuthGuard)
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Post('/')
  async addInvite(@Body() body: CreateInviteDto, @CurrentUser() owner: User) {
    const { userId, postId } = body;
    await this.inviteService.addInvite(postId, userId, owner);
  }

  @Get('/')
  async getInvites(@Query() data: Record<string, string>) {
    return this.inviteService.getInvitesByParams(data);
  }

  @Get(':_id')
  async getOneInvite(@Param() data: MongoIdDto) {
    return this.inviteService.getInvitesByParams({ _id: data._id });
  }

  @Patch(':_id')
  async takeDecision(
    @Param() data: MongoIdDto,
    @Body() body: DecisionDto,
    @CurrentUser() user: User
  ) {
    await this.inviteService.confirmOrReject(data._id, body.decision, user);
  }

  @Delete(':_id')
  async deleteInvite(@Param() data: MongoIdDto, @CurrentUser() user: User) {
    await this.inviteService.softDeleteInvite(data._id, user);
  }
}
