import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';

@Schema({ versionKey: false })
export class Place extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  location: string;

  @Prop()
  tags: string[];

  @Prop()
  ownerId: string;

  @Prop()
  avatarId?: string;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
