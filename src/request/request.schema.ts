import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database';
import { REQUEST_STATUS } from 'src/enums';

@Schema({ versionKey: false })
export class Request extends AbstractDocument {
  @Prop()
  requestStatus: REQUEST_STATUS;

  @Prop()
  userId: string;

  @Prop()
  postId: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
