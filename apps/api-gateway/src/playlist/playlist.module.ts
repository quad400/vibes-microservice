import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { PlaylistRepository } from './repos/playlist.repository';
import { PlaylistTrackRepository } from './repos/playlist-tracks.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Config } from '@libs/common/config';

@Module({
  imports: [
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: Config.USER_SERVICE,
          transport: Transport.REDIS,
          options: {
            host: Config.REDIS_HOST,
            port: Config.REDIS_PORT,
          },
        },
      ],
    }),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistRepository, PlaylistTrackRepository],
})
export class PlaylistModule {}
