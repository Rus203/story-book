import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';

@Schema({ versionKey: false })
export class Member extends AbstractDocument {
  @Prop()
  postId: string;

  @Prop()
  participants: string[];

  @Prop()
  currentWomenCount: number;

  @Prop()
  currentMenCount: number;

  @Prop()
  currentOthersCount: number;

  currentGuestWomenCount: number;

  @Prop()
  currentGuestMenCount: number;

  @Prop()
  currentGuestOthersCount: number;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
