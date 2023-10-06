import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}
