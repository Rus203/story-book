import { SHOWN_GENDER, SEXUAL_ORIENTATION, GENDER } from 'src/enums';
import { IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class InfoSexualOrientation {
  @IsEnum(SEXUAL_ORIENTATION)
  value: SEXUAL_ORIENTATION;

  @IsOptional()
  @IsBoolean()
  isShown?: boolean;
}

class InfoGender {
  @IsEnum(GENDER)
  value: GENDER;

  @IsOptional()
  @IsBoolean()
  isShown?: boolean;
}

export class PersonalInfoDto {
  @IsEnum(SHOWN_GENDER)
  shownGender: SHOWN_GENDER;

  @ValidateNested()
  @Type(() => InfoSexualOrientation)
  sexualOrientation: InfoSexualOrientation;

  @ValidateNested()
  @Type(() => InfoGender)
  gender: InfoGender;
}
