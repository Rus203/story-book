import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';
import { DataBaseModule } from 'src/database';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema, Image } from './image.schema';

@Module({
  providers: [ImageService, ImageRepository],
  exports: [ImageService],
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
})
export class ImageModule {}
