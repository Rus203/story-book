import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Post } from './post.schema';

@Injectable()
export class PostRepository extends AbstractRepository<Post> {
  protected readonly logger = new Logger();
  constructor(
    @InjectModel(Post.name) PostModel: Model<Post>,
    @InjectConnection() connection: Connection
  ) {
    super(PostModel, connection);
  }
}
