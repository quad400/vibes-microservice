import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { FavouriteAlbumEntity } from '../entities/favourite-album.entity';

@Injectable()
export class FavouriteAlbumRepository extends AbstractRepository<FavouriteAlbumEntity> {
  constructor(
    @InjectRepository(FavouriteAlbumEntity)
    protected readonly favouriteAlbumRepo: Repository<FavouriteAlbumEntity>,
  ) {
    super(favouriteAlbumRepo); 
  }
}

