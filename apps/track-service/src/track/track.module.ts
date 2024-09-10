import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TrackRepository } from './repos/track.repository';
import { TrackLikeRepository } from './repos/track-like.repository';
import { PlayRepository } from './repos/play.repository';
import { AlbumRepository } from '../album/repos/album.repository';

@Module({
  controllers: [TrackController],
  providers: [
    TrackService,
    TrackRepository,
    TrackLikeRepository,
    PlayRepository,
    AlbumRepository
  ],
})
export class TrackModule {}
