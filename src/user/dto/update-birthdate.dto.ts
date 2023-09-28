import { IsDate, IsNotEmpty } from 'class-validator';

export class UpdateBirthDateDto {
  @IsNotEmpty()
  @IsDate()
  birthDate: Date;
}
