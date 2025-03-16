import { Repository, EntityTarget, DataSource, ObjectLiteral, FindOptionsWhere, DeepPartial, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';


@Injectable()
export class GenericRepository<T extends ObjectLiteral> {
    private repository: Repository<T>;

    constructor(private readonly dataSource: DataSource, entity: EntityTarget<T>) {
        this.repository = this.dataSource.getRepository(entity);
    }

    async findAll(): Promise<T[]> {
        return this.repository.find();
    }
    
    async findOne(id: number): Promise<T | null> {
        const primaryKey = this.repository.metadata.primaryColumns[0].propertyName; /* 동적 PK 필드 가져오기 */ 
        return this.repository.findOne({ where: { [primaryKey]: id } as FindOptionsWhere<T> });
    }

    async create(data: DeepPartial<T>): Promise<T> {
        return this.repository.save(data);
    }

    async update(id: number, data: Partial<T>): Promise<void> {
        await this.repository.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    /**
     * 특정 컬럼만 조회하는 기능을 제공.
     * 
     * @param alias 
     * @returns 
     */
    getQueryBuilder(alias: string): SelectQueryBuilder<T> {
        return this.repository.createQueryBuilder(alias);
    }
}