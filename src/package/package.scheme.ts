import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';

@Schema({ versionKey: false })
export class Package extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  tags: string[];

  @Prop()
  description: string;

  @Prop()
  date: string;

  @Prop()
  minSpend: number;

  @Prop()
  maxPeople: number;

  @Prop()
  placeId: string;

  @Prop()
  ownerId: string;

  @Prop()
  avatarId?: string;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
