import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
  SelectQueryBuilder,
  Like,
  ILike,
} from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { SearchKey } from '../enums/search.enum';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(
    protected readonly repository: Repository<T>,
    private readonly entityName: string,
  ) {
    this.repository = repository;
  }
  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  // Unique check method
  async checkUnique(
    data: Record<string, any>,
    uniqueField: string,
  ): Promise<boolean> {
    const entity = await this.repository.findOne({
      where: {
        [uniqueField]: data[uniqueField],
        is_deleted: false,
      } as FindOneOptions['where'],
    });

    if (entity) {
      throw new ConflictException(
        `${this.entityName} with ${uniqueField} "${data[uniqueField]}" already exists.`,
      );
    }
    return true;
  }

  // Create method with uniqueness check and active records only
  async create(data: DeepPartial<T>, uniqueField?: string): Promise<T> {
    await this.checkUnique(data, uniqueField);
    return await this.repository.save(data as T);
  }

  // Create method with uniqueness check and active records only
  async createWithoutUniqueCheck(
    data: DeepPartial<T>,
    uniqueField?: string,
  ): Promise<T> {
    // await this.repository.create(data);
    return await this.repository.save(data as T);
  }

  // Find one method with isDeleted check
  async findOne(id: string, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id, is_deleted: false } as FindOneOptions['where'],
      ...options,
    });
    if (!entity) {
      throw new NotFoundException(
        `${this.entityName} with ID "${id}" does not exist or has been deleted.`,
      );
    }
    return entity;
  }

  // Find one method with isDeleted check
  async findOneData({
    bypassExistenceCheck = false,
    options,
  }: {
    data?: Record<string, any>;
    bypassExistenceCheck?: boolean;
    options?: FindOneOptions<T>;
  }): Promise<T> {
    const entity = await this.repository.findOne({
      where: { is_deleted: false } as FindOneOptions['where'],
      ...options,
    });
    options.where;

    if (!entity && !bypassExistenceCheck) {
      throw new NotFoundException(
        `${this.entityName} with "${JSON.stringify(options.where)}" does not exist or has been deleted.`,
      );
    }

    return entity;
  }

  // Find one method without isDeleted check
  async findOneWithoutDeleteCheck({
    data,
    options,
  }: {
    data: Record<string, any>;
    options?: FindOneOptions<T>;
  }): Promise<T> {
    const entity = await this.repository.findOne({
      where: { ...data } as FindOneOptions['where'],
      ...options,
    });

    if (!entity) {
      throw new NotFoundException(
        `${this.entityName} with ID "${typeof data === 'string' ? data : JSON.stringify(data)}" does not exist.`,
      );
    }
    return entity;
  }

  // Pagination method with isDeleted check and total count
  async paginatedFind({
    options,
    search,
    page = 1,
    limit = 10,
    searchKey = SearchKey.NAME,
  }: {
    options: FindManyOptions<T>;
    page?: number;
    limit?: number;
    searchKey?: SearchKey;
    search?: string;
  }): Promise<{
    data: T[];
    total: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const whereCondition = {
      is_deleted: false,
      ...(options.where as FindManyOptions['where']),
      ...(search
        ? searchKey === SearchKey.NAME
          ? { name: ILike(`%${search}%`) } // Case-insensitive search for name
          : { title: ILike(`%${search}%`) } // Case-insensitive search for title
        : {}),
    } as FindManyOptions['where'];

    const [data, total] = await this.repository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      ...options,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      total,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
      data,
    };
  }

  async findAll({
    options,
    search,
  }: {
    options: FindManyOptions<T>;
    search?: string;
  }) {
    const whereCondition = {
      is_deleted: false,
      ...(options.where as FindManyOptions['where']),
      ...(search && { name: ILike(`%${search}%`) }),
    } as FindManyOptions['where'];
    const data = await this.repository.find({
      where: whereCondition,
      ...options,
    });

    return data;
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  // Soft delete: Set isDeleted to true instead of removing the entity
  async softDelete(id: string): Promise<void> {
    const entity = await this.findOne(id);
    entity['is_deleted'] = true; // Dynamically setting isDeleted
    await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }

  // Update method with existence check
  async update(id: string, data: Partial<T>, uniqueField?: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id, is_deleted: false } as FindOneOptions['where'],
    });
    if (!entity) {
      throw new NotFoundException(
        `Cannot update. Entity with ID "${id}" does not exist or has been deleted.`,
      );
    }

    if (uniqueField) await this.checkUnique(data, uniqueField);

    Object.assign(entity, data);
    return await this.repository.save(entity);
  }

  // Restore soft deleted entity
  async restore(id: string): Promise<void> {
    const entity = await this.repository.findOneBy({
      id: id,
      is_deleted: true,
    } as FindOneOptions['where']);
    if (!entity) {
      throw new NotFoundException(
        `Cannot restore. Entity with ID "${id}" does not exist or has not been deleted.`,
      );
    }
    entity['is_deleted'] = false;
    await this.repository.save(entity);
  }
}
