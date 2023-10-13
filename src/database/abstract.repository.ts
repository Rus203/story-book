import { AbstractDocument } from './abstract.entity';
import {
  Connection,
  FilterQuery,
  Model,
  SaveOptions,
  UpdateQuery,
  Types,
} from 'mongoose';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
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
      isActive: true,
    });
    return (await newDocument.save(options)).toJSON() as TDocument;
  }

  async find(
    entityFilterQuery: FilterQuery<TDocument>,
    projection?: Record<string, unknown>
  ) {
    return this.model.find(
      {
        isActive: true,
        ...entityFilterQuery,
      },
      { ...projection, isActive: false },
      { lean: true }
    );
  }

  async findAll(
    entityFilterQuery: FilterQuery<TDocument>,
    projection?: Record<string, unknown>
  ) {
    return this.model.find(
      {
        ...entityFilterQuery,
      },
      { ...projection, isActive: false },
      { lean: true }
    );
  }

  async findOne(
    entityFilterQuery: FilterQuery<TDocument>,
    projection?: Record<string, unknown>,
    populateField?: string
  ) {
    const document = populateField
      ? await this.model
          .findOne(
            { isActive: true, ...entityFilterQuery },
            { ...projection, isActive: false },
            {
              lean: true,
            }
          )
          .populate(populateField)
      : await this.model.findOne(
          { isActive: true, ...entityFilterQuery },
          { ...projection, isActive: false },
          { lean: true }
        );

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
      { isActive: true, ...entityFilterQuery },
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
}
