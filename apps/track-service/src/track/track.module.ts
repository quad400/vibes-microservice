import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TrackRepository } from './repos/track.repository';
import { TrackLikeRepository } from './repos/track-like.repository';
import { PlayRepository } from './repos/play.repository';
import { AlbumRepository } from '../album/repos/album.repository';
import { BullModule } from '@nestjs/bull';
import { Config } from '@libs/common/config';
import { TrackPlayConsumer } from './consumer/play.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Config.TRACK_PLAY_QUEUE,
    }),
  ],
  controllers: [TrackController],
  providers: [
    TrackService,
    TrackRepository,
    TrackLikeRepository,
    PlayRepository,
    AlbumRepository,
    TrackPlayConsumer
  ],
})
export class TrackModule {}
