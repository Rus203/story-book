import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ImageIdDto {
  @IsNotEmpty()
  @IsMongoId()
  imageId: string;
}
