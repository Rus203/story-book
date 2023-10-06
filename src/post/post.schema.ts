import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';
import { HOST_TYPE } from 'src/enums/host-type.enum';
import { GENDER, POST_STATUS } from 'src/enums';

@Schema({ versionKey: false })
export class Post extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  date: string;

  @Prop()
  location: string;

  @Prop()
  tags: string[];

  @Prop()
  venue: string;

  @Prop()
  menCount: number;

  @Prop()
  womenCount: number;

  @Prop()
  othersCount: number;

  @Prop()
  guestMenCount: number;

  @Prop()
  guestWomenCount: number;

  @Prop()
  guestOthersCount: number;

  @Prop()
  packageId: string;

  @Prop()
  description: string;

  @Prop()
  hostType: HOST_TYPE;

  @Prop()
  gender: GENDER[];

  @Prop()
  ownerId: string;

  @Prop()
  postStatus: POST_STATUS;
}

export const PostSchema = SchemaFactory.createForClass(Post);
