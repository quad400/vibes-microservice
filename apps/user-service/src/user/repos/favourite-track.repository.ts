import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { FavouriteTrackEntity } from '../entities/favourite-track.entity';

@Injectable()
export class FavouriteTrackRepository extends AbstractRepository<FavouriteTrackEntity> {
  constructor(
    @InjectRepository(FavouriteTrackEntity)
    protected readonly favouriteTrackRepo: Repository<FavouriteTrackEntity>,
  ) {
    super(favouriteTrackRepo, "Track"); 
  }
}

