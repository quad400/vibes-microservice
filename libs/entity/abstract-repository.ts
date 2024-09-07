import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(protected readonly repository: Repository<T>) {
    this.repository = repository;
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  // Create method with uniqueness check and active records only
  async create(data: Partial<T>, uniqueField: string): Promise<T> {
    const whereCondition = {
      [uniqueField]: data[uniqueField],
      is_deleted: false,
    } as any; // Casting as any to avoid type error

    const exists = await this.repository.findOne({
      where: whereCondition,
    });
    if (exists) {
      throw new ConflictException(
        `${String(uniqueField)} "${data[uniqueField]}" already exists in the database.`,
      );
    }
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
        `Entity with ID "${id}" does not exist or has been deleted.`,
      );
    }
    return entity;
  }

  // Find one method with isDeleted check
  async findOneData(data: string, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne({
      where: { data, is_deleted: false } as FindOneOptions['where'],
      ...options,
    });
    if (!entity) {
      throw new NotFoundException(
        `Entity with ID "${data}" does not exist or has been deleted.`,
      );
    }
    return entity;
  }

  // Pagination method with isDeleted check and total count
  async paginatedFind(
    options: FindManyOptions<T>,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: T[];
    total: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const whereCondition = { is_deleted: false } as FindManyOptions['where'];
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
      data,
      total,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
    };
  }

  // Soft delete: Set isDeleted to true instead of removing the entity
  async softDelete(id: string): Promise<void> {
    const entity = await this.findOne(id);
    entity['is_deleted'] = true; // Dynamically setting isDeleted
    await this.repository.save(entity);
  }

  // Update method with existence check
  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id, is_deleted: false } as FindOneOptions['where'],
    });
    if (!entity) {
      throw new NotFoundException(
        `Cannot update. Entity with ID "${id}" does not exist or has been deleted.`,
      );
    }

    Object.assign(entity, data);
    return await this.repository.save(entity);
  }
}
