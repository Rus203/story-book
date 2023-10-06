import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    @InjectConnection() connection: Connection
  ) {
    super(userModel, connection);
  }
}
