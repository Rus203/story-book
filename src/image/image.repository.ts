import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Image } from './image.schema';

@Injectable()
export class ImageRepository extends AbstractRepository<Image> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(Image.name) imageModel: Model<Image>,
    @InjectConnection() connection: Connection
  ) {
    super(imageModel, connection);
  }
}
