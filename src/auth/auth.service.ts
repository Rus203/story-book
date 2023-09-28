import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async signUp(data: SignDto) {
    const { phoneNumber, password } = data;
    const existingUsers = await this.userService.getUsers({ phoneNumber });

    if (existingUsers.length > 0) {
      throw new ConflictException('The phone number has already busy');
    }

    return this.userService.addUser(phoneNumber, password);
  }

  async signIn(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, isActive, refreshToken, _id, ...other } = user;
    const tokens = {
      accessToken: await this.generateAccessToken({ _id }),
      refreshToken: await this.generateRefreshToken({ _id }),
    };

    await this.userService.recordField(
      { _id: user._id },
      { refreshToken: tokens.refreshToken }
    );

    return { tokens, ...other };
  }

  async refresh(_id: string, refreshToken: string) {
    let payload: { _id: string };
    try {
      payload = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }

    if (_id !== payload._id) {
      throw new ForbiddenException('Forbidden and');
    }

    const newRefreshToken = await this.generateRefreshToken({ _id });
    const newAccessToken = await this.generateAccessToken({ _id });

    await this.userService.recordField(
      { _id, refreshToken },
      { refreshToken: newRefreshToken }
    );

    return {
      _id,
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    };
  }

  async validate(phoneNumber: string, password: string) {
    const user = await this.userService.getOneUserByParamsWithPassword({
      phoneNumber,
    });

    if (!user) {
      return null;
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    return passwordIsValid ? user : null;
  }

  async generateAccessToken(payload: any) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TIME_LIVE'),
    });
  }

  async generateRefreshToken(payload: any) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TIME_LIVE'),
    });
  }

  async confirmPhone(phoneNumber: string, code: string) {
    const CONFIRMED_CODE = this.configService.get<string>('CONFIRMED_CODE');
    if (CONFIRMED_CODE !== code) {
      throw new BadRequestException('Invalid code');
    }

    const user = await this.userService.getOneUserByParams({ phoneNumber });

    const accessToken = await this.generateAccessToken({ _id: user._id });
    const refreshToken = await this.generateRefreshToken({ _id: user._id });

    await this.userService.recordField(
      { _id: user._id },
      { refreshToken, phoneVerified: true }
    );

    return { tokens: { accessToken, refreshToken }, _id: user._id };
  }
}