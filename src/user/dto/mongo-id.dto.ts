import { IsMongoId } from 'class-validator';

export class MongoIdDto {
  @IsMongoId()
  _id: string;
}
