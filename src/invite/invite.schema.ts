import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';
import { INVITE_STATUS } from 'src/enums';

@Schema({ versionKey: false })
export class Invite extends AbstractDocument {
  @Prop()
  postId: string;

  @Prop()
  userId: string;

  @Prop()
  inviteStatus: INVITE_STATUS;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
