import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from "../../../../../libs/entity/abstract-repository";
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly userRepo: Repository<UserEntity>,
  ) {
    super(userRepo); 
  }
}

