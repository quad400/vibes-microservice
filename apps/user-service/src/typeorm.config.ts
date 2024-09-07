import { DataSource, DataSourceOptions } from 'typeorm';
import { Config } from '../../../libs/config';
import { UserEntity } from './user/entities/user.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: Config.IS_PRODUCTION && Config.DB_URL_USER,
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_DATABASE_USER,
  entities: ['dist/apps/user-service/apps/user-service/src/user/entities/*.js'],
  migrations: ['dist/apps/user-service/apps/user-service/src/migrations/*.js'],
  synchronize: false,
};
const dataSource = new DataSource(typeOrmConfig);
export default dataSource;
