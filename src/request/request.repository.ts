import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Request } from './request.schema';

@Injectable()
export class RequestRepository extends AbstractRepository<Request> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(Request.name) RequestModel: Model<Request>,
    @InjectConnection() connection: Connection
  ) {
    super(RequestModel, connection);
  }
}
