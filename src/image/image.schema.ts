import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';

@Schema({ versionKey: false })
export class Image extends AbstractDocument {
  @Prop()
  imagePath: string;

  @Prop()
  isActive: boolean;

  @Prop()
  ownerId?: string;

  @Prop()
  placeId?: string;

  @Prop()
  packageId?: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
