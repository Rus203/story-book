import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  minSpend: number;

  @IsNotEmpty()
  @IsNumber()
  maxPeople: number;

  @IsNotEmpty()
  @IsMongoId()
  placeId: string;
}
