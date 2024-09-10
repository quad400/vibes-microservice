import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '@libs/common/common/database.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../../libs/common/guard/auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Config } from '@libs/common/config';
import { ArtistModule } from './artist/artist.module';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    DatabaseModule,
    UserModule,
    AuthModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: Config.REDIS_URL,
      ttl: 50000,
    }),
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: Config.USER_SERVICE,
        },
      ],
    }),
    ArtistModule,
  ],
  
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})

export class UserServiceModule {}
