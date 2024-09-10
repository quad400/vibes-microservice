import { Module } from '@nestjs/common';
import { AlbumModule } from './album/album.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { DatabaseModule } from '@libs/common/common/database.module';
import { Config } from '@libs/common/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@libs/common/common/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    DatabaseModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: Config.REDIS_URL,
      ttl: 50000,
    }),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: Config.JWT_EXPIRES_IN },
    }),
    AlbumModule,
    TrackModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class TrackServiceModule {}
