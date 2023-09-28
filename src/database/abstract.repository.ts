import { AbstractDocument } from './abstract.entity';
import {
  ClientSession,
  Connection,
  FilterQuery,
  Model,
  SaveOptions,
  UpdateQuery,
  Types,
} from 'mongoose';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected readonly logger: Logger;
  constructor(
    private readonly model: Model<TDocument>,
    private readonly connection: Connection
  ) {}

  async create(
    document: Omit<TDocument, '_id' | 'isActive'>,
    options?: SaveOptions
  ): Promise<TDocument> {
    const newDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await newDocument.save(options)).toJSON() as TDocument;
  }

  async find(
    entityFilterQuery: FilterQuery<TDocument>,
    projection?: Record<string, unknown>
  ) {
    return this.model.find(entityFilterQuery, projection ?? {}, { lean: true });
  }

  async findOne(
    entityFilterQuery: FilterQuery<TDocument>,
    projection?: Record<string, unknown>
  ) {
    const document = await this.model.findOne(entityFilterQuery, projection, {
      lean: true,
    });

    if (!document) {
      this.logger.warn('Document not found with filterQuery');
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<TDocument>,
    updatedData: UpdateQuery<TDocument>
  ) {
    const document = await this.model.findOneAndUpdate(
      entityFilterQuery,
      updatedData,
      { lean: true, new: true }
    );

    if (!document) {
      this.logger.warn(
        'Document not found with filterQuery: ',
        entityFilterQuery
      );
      throw new ConflictException('Conflict');
    }

    return document;
  }

  async upsert(
    entityFilterQuery: FilterQuery<TDocument>,
    updatedEntityData: Partial<TDocument>
  ) {
    return this.model.findOneAndUpdate(entityFilterQuery, updatedEntityData, {
      new: true,
      lean: true,
      upsert: true,
    });
  }

  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
