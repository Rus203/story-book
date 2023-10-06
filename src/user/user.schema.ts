import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';
import { GENDER, SEXUAL_ORIENTATION, SHOWN_GENDER } from 'src/enums';

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
  birthDate?: string;

  @Prop()
  phoneVerified: boolean;

  @Prop()
  password: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  avatarId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
