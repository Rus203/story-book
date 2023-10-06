import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'phoneNumber' });
  }

  async validate(phoneNumber: string, password: string) {
    const user = await this.authService.validate(phoneNumber, password);

    if (!user) {
      throw new UnauthorizedException('Incorrect phone number or password');
    }

    return user;
  }
}
