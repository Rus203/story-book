import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UpdateBirthDateDto,
  UpdateEmailDto,
  UpdateNickNameDto,
  PersonalInfoDto,
} from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { ImageIdDto, MongoIdDto } from 'src/dto';
import { User } from './user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFormatPipe } from '../pipe';
import * as multer from 'multer';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getUsers(@Query() data: Partial<User>) {
    return this.userService.getUsersByParams(data, true);
  }

  @Patch('email')
  async addEmailToUser(
    @Body() body: UpdateEmailDto,
    @CurrentUser() user: User
  ) {
    const filterQuery = { email: undefined, _id: user._id };
    await this.userService.recordField(filterQuery, { email: body.email });
  }

  @Patch('nick-name')
  async addNickToUser(
    @Body() body: UpdateNickNameDto,
    @CurrentUser() user: User
  ) {
    const filterQuery = { nickName: undefined, _id: user._id };
    await this.userService.recordField(filterQuery, {
      nickName: body.nickName,
    });
  }

  @Patch('birthdate')
  async addBirthDate(
    @Body() body: UpdateBirthDateDto,
    @CurrentUser() user: User
  ) {
    await this.userService.recordField(
      { _id: user._id.toString() },
      { birthDate: body.birthDate }
    );
  }

  @Patch('image')
  @UseInterceptors(
    FileInterceptor('imageData', { storage: multer.memoryStorage() })
  )
  async addImage(
    @CurrentUser() user: User,
    @UploadedFile(new FileFormatPipe()) file: Express.Multer.File
  ) {
    await this.userService.addImage(file, user);
  }

  @Patch('set-avatar')
  async setAvatar(@Body() body: ImageIdDto, @CurrentUser() user: User) {
    await this.userService.setAvatar(body.imageId, user);
  }

  @Delete('image')
  async deleteImage(@Body() body: ImageIdDto, @CurrentUser() user: User) {
    await this.userService.deleteImage(body.imageId, user);
  }

  @Patch('personal-info')
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

  @Get(':_id')
  async getUser(@Param() data: MongoIdDto) {
    return this.userService.getOneUserByParams({ _id: data._id }, {}, true);
  }

  @Delete(':_id')
  async deleteUser(@Param() data: MongoIdDto) {
    await this.userService.softDeleteUser(data._id);
  }
}
