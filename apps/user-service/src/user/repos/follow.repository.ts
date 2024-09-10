import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { FollowEntity } from '../entities/user-follow.entity';

@Injectable()
export class FollowRepository extends AbstractRepository<FollowEntity> {
  constructor(
    @InjectRepository(FollowEntity)
    protected readonly followRepo: Repository<FollowEntity>,
  ) {
    super(followRepo); 
  }
}

