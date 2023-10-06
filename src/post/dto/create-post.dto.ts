import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
  IsString,
} from 'class-validator';
import { GENDER } from 'src/enums';
import { HOST_TYPE } from 'src/enums/host-type.enum';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsString()
  venue: string;

  @IsNotEmpty()
  @IsNumber()
  menCount: number;

  @IsNotEmpty()
  @IsNumber()
  womenCount: number;

  @IsNotEmpty()
  @IsNumber()
  othersCount: number;

  @IsNotEmpty()
  @IsNumber()
  guestMenCount: number;

  @IsNotEmpty()
  @IsNumber()
  guestWomenCount: number;

  @IsNotEmpty()
  @IsNumber()
  guestOthersCount: number;

  @IsNotEmpty()
  @IsMongoId()
  packageId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(HOST_TYPE)
  hostType: HOST_TYPE;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(GENDER, { each: true })
  gender: GENDER[];
}
