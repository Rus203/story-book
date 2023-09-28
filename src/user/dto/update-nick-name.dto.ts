import { IsNotEmpty } from 'class-validator';

export class UpdateNickNameDto {
  @IsNotEmpty()
  nickName: string;
}
