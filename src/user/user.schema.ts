import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';
import { GENDER, SEXUAL_ORIENTATION, SHOWN_GENDER } from 'src/enums';
import { IImage } from 'src/interface';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  phoneNumber: string;

  @Prop({ type: { value: String, isShown: Boolean, _id: false } })
  sexualOrientation?: {
    value: SEXUAL_ORIENTATION;
    isShown?: boolean;
  };

  @Prop()
  nickName?: string;

  @Prop()
  shownGender?: SHOWN_GENDER;

  @Prop()
  email?: string;

  @Prop({ type: { value: String, isShown: Boolean, _id: false } })
  gender?: {
    value: GENDER;
    isShown?: boolean;
  };

  @Prop()
  birthDate?: Date;

  @Prop()
  phoneVerified: boolean;

  @Prop()
  password: string;

  @Prop()
  refreshToken?: string;

  @Prop({ default: [] })
  images?: IImage[];
}

export const UserSchema = SchemaFactory.createForClass(User);
