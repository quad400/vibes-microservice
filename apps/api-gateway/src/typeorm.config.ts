import { DataSource, DataSourceOptions } from 'typeorm';
import { Config } from '../../../libs/config';
import { AlbumEntity } from 'apps/track-service/src/album/entities/album.entity';
import { AlbumLikeEntity } from 'apps/track-service/src/album/entities/album-like.entity';
import { TrackEntity } from 'apps/track-service/src/track/entities/track.entity';
import { PlayEntity } from 'apps/track-service/src/track/entities/play.entity';
import { TrackLikeEntity } from 'apps/track-service/src/track/entities/track-like.entity';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';
import { ArtistEntity } from 'apps/user-service/src/artist/entities/artist.entity';
import { FollowEntity } from 'apps/user-service/src/user/entities/user-follow.entity';
import { FavouriteAlbumEntity } from 'apps/user-service/src/user/entities/favourite-album.entity';
import { FavouriteTrackEntity } from 'apps/user-service/src/user/entities/favourite-track.entity';
import { PlaylistEntity } from './playlist/entities/playlist.entity';
import { PlaylistTrackEntity } from './playlist/entities/playlist-track.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: Config.IS_PRODUCTION && Config.DB_URL_USER,
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_DATABASE_USER,
  entities: [
    UserEntity,
    ArtistEntity,
    AlbumEntity,
    AlbumLikeEntity,
    FollowEntity,
    FavouriteAlbumEntity,
    TrackEntity,
    PlayEntity,
    TrackLikeEntity,
    FavouriteTrackEntity,
    PlaylistEntity,
    PlaylistTrackEntity
  ],
  migrations: ['dist/apps/api-gateway/apps/api-gateway/src/migrations/*.js'],
  synchronize: false,
};
const dataSource = new DataSource(typeOrmConfig);
export default dataSource;
