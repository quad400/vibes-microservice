"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
const common_1 = require("@nestjs/common");
class AbstractRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(data, uniqueField) {
        const whereCondition = {
            [uniqueField]: data[uniqueField],
            is_deleted: false,
        };
        const exists = await this.repository.findOne({
            where: whereCondition,
        });
        if (exists) {
            throw new common_1.ConflictException(`${String(uniqueField)} "${data[uniqueField]}" already exists in the database.`);
        }
        return await this.repository.save(data);
    }
    async findOne(id, options) {
        const entity = await this.repository.findOne({
            where: { id, is_deleted: false },
            ...options,
        });
        if (!entity) {
            throw new common_1.NotFoundException(`Entity with ID "${id}" does not exist or has been deleted.`);
        }
        return entity;
    }
    async paginatedFind(options, page = 1, limit = 10) {
        const whereCondition = { is_deleted: false };
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
    async softDelete(id) {
        const entity = await this.findOne(id);
        entity['is_deleted'] = true;
        await this.repository.save(entity);
    }
    async update(id, data) {
        const entity = await this.repository.findOne({
            where: { id, is_deleted: false },
        });
        if (!entity) {
            throw new common_1.NotFoundException(`Cannot update. Entity with ID "${id}" does not exist or has been deleted.`);
        }
        Object.assign(entity, data);
        return await this.repository.save(entity);
    }
}
exports.AbstractRepository = AbstractRepository;
//# sourceMappingURL=abstract-repository.js.map