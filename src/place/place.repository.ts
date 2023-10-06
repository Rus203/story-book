import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database';
import { Place } from './place.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class PlaceRepository extends AbstractRepository<Place> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(Place.name) placeModel: Model<Place>,
    @InjectConnection() connection: Connection
  ) {
    super(placeModel, connection);
  }
}
