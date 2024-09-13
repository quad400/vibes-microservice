import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { PlaylistEntity } from '../entities/playlist.entity';


@Injectable()
export class PlaylistRepository extends AbstractRepository<PlaylistEntity> {
  constructor(
    @InjectRepository(PlaylistEntity)
    protected readonly playlistRepo: Repository<PlaylistEntity>,
  ) {
    super(playlistRepo, "Playlist"); 
  }
}

