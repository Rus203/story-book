import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Package } from './package.scheme';

@Injectable()
export class PackageRepository extends AbstractRepository<Package> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(Package.name) PackageModel: Model<Package>,
    @InjectConnection() connection: Connection
  ) {
    super(PackageModel, connection);
  }
}
