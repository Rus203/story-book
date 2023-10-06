import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './database/database.module';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { PlaceModule } from './place/place.module';
import { PackageModule } from './package/package.module';
import { PostModule } from './post/post.module';
import { ImageModule } from './image/image.module';
import { InviteModule } from './invite/invite.module';
import { MemberModule } from './member/member.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./.env'],
      validationSchema: Joi.object({
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_PORT: Joi.string().required(),
        PORT: Joi.string().required(),
        ACCESS_SECRET: Joi.string().required(),
        ACCESS_TIME_LIVE: Joi.string().required(),
        REFRESH_SECRET: Joi.string().required(),
        REFRESH_TIME_LIVE: Joi.string().required(),
        CONFIRMED_CODE: Joi.string().required(),
        PUBLIC_FOLDER: Joi.string().required(),
      }),
    }),
    DataBaseModule,
    UserModule,
    AuthModule,
    PlaceModule,
    ImageModule,
    PackageModule,
    PostModule,
    InviteModule,
    MemberModule,
    RequestModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
