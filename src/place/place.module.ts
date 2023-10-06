import { Module } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { DataBaseModule } from 'src/database';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from './place.schema';
import { UserModule } from 'src/user/user.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  providers: [PlaceRepository, PlaceService],
  controllers: [PlaceController],
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    UserModule,
    ImageModule,
  ],
  exports: [PlaceService],
})
export class PlaceModule {}
