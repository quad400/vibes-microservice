import { DataSource, DataSourceOptions } from 'typeorm';
import { Config } from '../../../libs/config';


export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  // url: Config.IS_PRODUCTION && Config.DB_URL_GATEWAY,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  // entities: ["dist/apps/api-service/entities/*.js"],
  // migrations: ['dist/apps/api-service/migrations/*.js'],
  synchronize: false,
};

const dataSource = new DataSource(typeOrmConfig);
export default dataSource 