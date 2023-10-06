import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DataBaseModule } from 'src/database';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { ImageModule } from 'src/image/image.module';

@Module({
  providers: [UserService, UserRepository],
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ImageModule,
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
