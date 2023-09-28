import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UpdateBirthDateDto,
  UpdateEmailDto,
  UpdateNickNameDto,
  MongoIdDto,
  ImageDto,
  CreateImageDto,
  PersonalInfoDto,
} from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { OwnerGuard } from './guard/owner.guard';
import { CurrentUser } from 'src/auth/decorators';
import { User } from './user.schema';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getUsers(@Query() data: Partial<User>, @CurrentUser() user: User) {
    console.log('user: ', user);
    return this.userService.getUsers(data);
  }

  @Get(':_id')
  async getUserById(@Param() data: MongoIdDto) {
    return this.userService.getOneUserByParams({ _id: data._id });
  }

  @UseGuards(OwnerGuard)
  @Delete(':_id')
  async deleteUserById(@Param() data: MongoIdDto) {
    await this.userService.softDelete(data._id);
  }

  @UseGuards(OwnerGuard)
  @Patch(':_id/email')
  async addEmailToUser(
    @Param() data: MongoIdDto,
    @Body() body: UpdateEmailDto
  ) {
    const filterQuery = { _id: data._id, email: undefined };
    await this.userService.recordField(filterQuery, { email: body.email });
  }

  @UseGuards(OwnerGuard)
  @Patch(':_id/nickName')
  async addNickToUser(
    @Param() data: MongoIdDto,
    @Body() body: UpdateNickNameDto
  ) {
    const filterQuery = { _id: data._id, nickName: undefined };
    await this.userService.recordField(filterQuery, { email: body.nickName });
  }

  @UseGuards(OwnerGuard)
  @Patch(':_id/birthdate')
  async addBirthDate(
    @Param() data: MongoIdDto,
    @Body() body: UpdateBirthDateDto
  ) {
    await this.userService.recordField({ _id: data._id }, body.birthDate);
  }

  @UseGuards(OwnerGuard)
  @Patch(':_id/image')
  async addImage(@Body() body: CreateImageDto, @CurrentUser() user: User) {
    await this.userService.addImage(body.imageData, user);
  }

  @UseGuards(OwnerGuard)
  @Patch(':_id/set-avatar')
  async setAvatar(@Body() body: ImageDto, @CurrentUser() user: User) {
    await this.userService.setAvatar(body.imagePath, user);
  }

  @UseGuards(OwnerGuard)
  @Patch(':_id/personal-info')
  async setPersonal(@Body() body: PersonalInfoDto, @CurrentUser() user: User) {
    const { gender, sexualOrientation, shownGender } = body;

    const updatedEntityData = {
      gender: {
        value: gender.value,
        isShown: gender.isShown ?? false,
      },
      sexualOrientation: {
        value: sexualOrientation.value,
        isShown: sexualOrientation.isShown ?? false,
      },
      shownGender,
    };
    await this.userService.recordField({ _id: user._id }, updatedEntityData);
  }

  @UseGuards(OwnerGuard)
  @Delete(':_id/image')
  async deleteImage(
    @Param() data: MongoIdDto,
    @Body() body: ImageDto,
    @CurrentUser() user: User
  ) {
    await this.userService.softDeleteImage(body.imagePath, user);
  }
}
