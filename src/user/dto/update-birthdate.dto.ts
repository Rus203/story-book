import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBirthDateDto {
  @IsNotEmpty()
  @IsString()
  birthDate: string;
}
