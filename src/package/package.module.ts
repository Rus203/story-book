import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { PackageRepository } from './package.repository';
import { DataBaseModule } from 'src/database';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from './package.scheme';
import { PlaceModule } from 'src/place/place.module';
import { ImageModule } from 'src/image/image.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [PackageService, PackageRepository],
  controllers: [PackageController],
  imports: [
    DataBaseModule,
    PlaceModule,
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    ImageModule,
    UserModule,
  ],
  exports: [PackageService],
})
export class PackageModule {}
