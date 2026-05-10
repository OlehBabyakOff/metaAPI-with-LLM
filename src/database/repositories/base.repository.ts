import { Document, QueryFilter, Model, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T> {
  findOne(filter: QueryFilter<T>): Promise<T | null>;
  findMany(filter?: QueryFilter<T>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  updateOne(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T | null>;
  upsert(filter: QueryFilter<T>, data: Partial<T>): Promise<T>;
}

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}
  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findMany(filter: QueryFilter<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateOne(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async upsert(filter: QueryFilter<T>, data: Partial<T>): Promise<T> {
    return this.model
      .findOneAndUpdate(filter, { $set: data }, { upsert: true, new: true })
      .exec() as Promise<T>;
  }
}
