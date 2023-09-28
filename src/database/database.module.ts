import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const MONGO_USERNAME = configService.get<string>('MONGO_USERNAME');
        const MONGO_PASSWORD = configService.get<string>('MONGO_PASSWORD');
        const MONGO_PORT = configService.get<string>('MONGO_PORT');
        const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@db:${MONGO_PORT}`;
        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DataBaseModule {}
