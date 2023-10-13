import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { ImageIdDto, MongoIdDto } from 'src/dto';
import { Package } from './package.scheme';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreatePackageDto } from './dto';
import { CurrentUser } from 'src/auth/decorators';
import { User } from 'src/user/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { FileFormatPipe } from 'src/pipe';

@Controller('package')
@UseGuards(JwtAuthGuard)
export class PackageController {
  constructor(private packageService: PackageService) {}

  @Get('/')
  async getPackages(@Query() data: Partial<Package>) {
    return this.packageService.getPackagesByParams(data);
  }

  @Post('/')
  async addPackage(@Body() body: CreatePackageDto, @CurrentUser() owner: User) {
    await this.packageService.addPackage(body, owner);
  }

  @Get(':_id')
  async getPackage(@Param() data: MongoIdDto) {
    return this.packageService.getOnePackageByParams({ _id: data._id });
  }

  @Delete(':_id')
  async deletePackage(@Param() data: MongoIdDto, @CurrentUser() owner: User) {
    await this.packageService.softDeletePackage(data._id, owner);
  }

  @Patch(':_id')
  async updatePackage() {
    await this.packageService.updatePackage();
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
    return this.packageService.addImagePackage(data._id, file, user);
  }

  @Patch(':_id/set-avatar')
  async setAvatar(
    @Param() data: MongoIdDto,
    @Body() body: ImageIdDto,
    @CurrentUser() user: User
  ) {
    await this.packageService.setPackageAvatar(data._id, body.imageId, user);
  }

  @Delete(':_id/image')
  async deleteImage(
    @Param() data: MongoIdDto,
    @Body() body: ImageIdDto,
    @CurrentUser() user: User
  ) {
    await this.packageService.softDeleteImagePackage(
      data._id,
      body.imageId,
      user
    );
  }
}
