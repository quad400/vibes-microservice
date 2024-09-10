import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repos/user.repository';
import { FollowRepository } from './repos/follow.repository';
import { FavouriteAlbumRepository } from './repos/favourite-album.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Config } from '@libs/common/config';
import { FavouriteTrackRepository } from './repos/favourite-track.repository';

@Module({
  imports: [
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: Config.TRACK_SERVICE,
          transport: Transport.REDIS,
          options: {
            host: Config.REDIS_HOST,
            port: Config.REDIS_PORT,
          },
        },
      ],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    FollowRepository,
    FavouriteAlbumRepository,
    FavouriteTrackRepository,
  ],
})
export class UserModule {}
