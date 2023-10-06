import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators';
import { CreatePlaceDto } from './dto';
import { Place } from './place.schema';
import { MongoIdDto, ImageIdDto } from 'src/dto';
import { User } from 'src/user/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { FileFormatPipe } from 'src/pipe';

@Controller('place')
@UseGuards(JwtAuthGuard)
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get('/')
  async getPlaces(@Query() data: Partial<Place>) {
    return this.placeService.getPlacesByParams(data);
  }

  @Post('/')
  async addPlace(@Body() body: CreatePlaceDto, @CurrentUser() owner: User) {
    const { name, location, tags } = body;
    await this.placeService.addPlace({
      name,
      location,
      tags,
      ownerId: owner._id,
    });
  }

  @Get(':_id')
  async getPlace(@Param() data: MongoIdDto) {
    return this.placeService.getOnePlaceByParams({ _id: data._id });
  }

  @Patch(':_id')
  async changePlace() {
    return this.placeService.updatePlace();
  }

  @Delete(':_id')
  async deletePlace(@Param() data: MongoIdDto, @CurrentUser() owner: User) {
    await this.placeService.softDeletePlace(data._id, owner);
  }

  @Patch(':_id/image')
  @UseInterceptors(
    FileInterceptor('imageData', { storage: multer.memoryStorage() })
  )
  async addImage(
    @Param() data: MongoIdDto,
    @UploadedFile(new FileFormatPipe()) file: Express.Multer.File,
    @CurrentUser() user: User
  ) {
    await this.placeService.addImage(data._id, file, user);
  }

  @Patch(':_id/set-avatar')
  async setAvatar(
    @Param() data: MongoIdDto,
    @Body() body: ImageIdDto,
    @CurrentUser() user: User
  ) {
    await this.placeService.setAvatar(data._id, body.imageId, user);
  }

  @Delete(':_id/image')
  async deleteImage(
    @Param() data: MongoIdDto,
    @Body() body: ImageIdDto,
    @CurrentUser() user: User
  ) {
    await this.placeService.softDeleteImage(data._id, body.imageId, user);
  }
}
