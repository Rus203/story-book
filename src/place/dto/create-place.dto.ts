import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsString()
  name: string;
}
