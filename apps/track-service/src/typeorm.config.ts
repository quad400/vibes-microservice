import { DataSource, DataSourceOptions } from 'typeorm';
import { Config } from '../../../libs/config';
import { AlbumEntity } from './album/entities/album.entity';
import { AlbumLikeEntity } from './album/entities/album-like.entity';
import { UserEntity } from 'apps/user-service/src/user/entities/user.entity';
import { FollowEntity } from 'apps/user-service/src/user/entities/user-follow.entity';
import { ArtistEntity } from 'apps/user-service/src/artist/entities/artist.entity';
import { FavouriteAlbumEntity } from 'apps/user-service/src/user/entities/favourite-album.entity';
import { TrackEntity } from './track/entities/track.entity';
import { PlayEntity } from './track/entities/play.entity';
import { TrackLikeEntity } from './track/entities/track-like.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: Config.IS_PRODUCTION && Config.DB_URL_TRACK,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  database: Config.DB_DATABASE_TRACK,
  entities: [
    AlbumEntity,
    AlbumLikeEntity,
    UserEntity,
    FollowEntity,
    ArtistEntity,
    FavouriteAlbumEntity,
    TrackEntity,
      PlayEntity,
      TrackLikeEntity
  ],
  migrations: [
    'dist/apps/track-service/apps/track-service/src/migrations/*.js',
  ],
  synchronize: false,
};

const dataSource = new DataSource(typeOrmConfig);
export default dataSource;
