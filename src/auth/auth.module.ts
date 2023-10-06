import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, LocalStrategy } from './strategies';
import { UserModule } from 'src/user/user.module';
import { ImageService } from 'src/image/image.service';
import { ImageModule } from 'src/image/image.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ImageModule,
  ],
})
export class AuthModule {}
