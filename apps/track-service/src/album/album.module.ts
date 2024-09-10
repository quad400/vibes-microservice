import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './repos/album.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Config } from '@libs/common/config';
import { AlbumLikeRepository } from './repos/album-like.repository';

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
            port: Config.REDIS_PORT
          }
        },
      ],
    }),
  ],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository, AlbumLikeRepository],
})
export class AlbumModule {}
