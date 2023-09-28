import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SignDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
