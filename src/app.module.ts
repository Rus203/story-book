import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { UserModule } from './user/user.module';
import { PlaceModule } from './place/place.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
