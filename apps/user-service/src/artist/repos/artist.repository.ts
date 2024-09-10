import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { ArtistEntity } from '../entities/artist.entity';

@Injectable()
export class ArtistRepository extends AbstractRepository<ArtistEntity> {
  constructor(
    @InjectRepository(ArtistEntity)
    protected readonly artistRepo: Repository<ArtistEntity>,
  ) {
    super(artistRepo); 
  }
}

