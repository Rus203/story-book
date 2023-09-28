import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmDto, RefreshDto, SignDto } from './dto';
import { LocalAuthGuard } from './guards';
import { MongoIdDto } from 'src/user/dto';
import { CurrentUser } from 'src/auth/decorators';
import { User } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() data: SignDto) {
    await this.authService.signUp(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@CurrentUser() user: User) {
    return this.authService.signIn(user);
  }

  @Patch('confirm')
  async confirm(@Body() body: ConfirmDto) {
    const { phoneNumber, code } = body;
    return this.authService.confirmPhone(phoneNumber, code);
  }

  @Post(':_id/refresh')
  async refreshToken(@Param() data: MongoIdDto, @Body() body: RefreshDto) {
    return this.authService.refresh(data._id, body.refreshToken);
  }
}
