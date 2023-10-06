import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Invite } from './invite.schema';

@Injectable()
export class InviteRepository extends AbstractRepository<Invite> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(Invite.name) InviteModel: Model<Invite>,
    @InjectConnection() connection: Connection
  ) {
    super(InviteModel, connection);
  }
}
