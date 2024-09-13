import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistTrackEntity } from 'apps/api-gateway/src/playlist/entities/playlist-track.entity';
import { PlaylistEntity } from 'apps/api-gateway/src/playlist/entities/playlist.entity';
import { AlbumLikeEntity } from 'apps/track-service/src/album/entities/album-like.entity';
import { AlbumEntity } from 'apps/track-service/src/album/entities/album.entity';
import { PlayEntity } from 'apps/track-service/src/track/entities/play.entity';
import { TrackLikeEntity } from 'apps/track-service/src/track/entities/track-like.entity';
import { TrackEntity } from 'apps/track-service/src/track/entities/track.entity';
import { ArtistEntity } from 'apps/user-service/src/artist/entities/artist.entity';
import { FavouriteAlbumEntity } from 'apps/user-service/src/user/entities/favourite-album.entity';
import { FavouriteTrackEntity } from 'apps/user-service/src/user/entities/favourite-track.entity';
import { FollowEntity } from 'apps/user-service/src/user/entities/user-follow.entity';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FollowEntity,
      ArtistEntity,
      AlbumEntity,
      AlbumLikeEntity,
      FavouriteAlbumEntity,
      TrackEntity,
      PlayEntity,
      TrackLikeEntity,
      FavouriteTrackEntity,
      PlaylistEntity,
      PlaylistTrackEntity
    ]),
  ],
  exports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FollowEntity,
      ArtistEntity,
      AlbumEntity,
      AlbumLikeEntity,
      FavouriteAlbumEntity,
      TrackEntity,
      PlayEntity,
      TrackLikeEntity,
      FavouriteTrackEntity,
      PlaylistEntity,
      PlaylistTrackEntity
    ]),
  ],
})
export class DatabaseModule {}
