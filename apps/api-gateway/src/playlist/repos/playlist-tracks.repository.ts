import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from "@libs/common/entity/abstract-repository";
import { PlaylistTrackEntity } from '../entities/playlist-track.entity';


@Injectable()
export class PlaylistTrackRepository extends AbstractRepository<PlaylistTrackEntity> {
  constructor(
    @InjectRepository(PlaylistTrackEntity)
    protected readonly playlistTrackRepo: Repository<PlaylistTrackEntity>,
  ) {
    super(playlistTrackRepo, "PlaylistTrack"); 
  }
}

