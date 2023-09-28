import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ConfirmDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
