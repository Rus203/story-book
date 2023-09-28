import { Schema, Prop } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: string;

  @Prop({ default: true })
  isActive: boolean;
}
