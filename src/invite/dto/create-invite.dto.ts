import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}
