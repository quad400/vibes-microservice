import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaylistModule } from './playlist/playlist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { DatabaseModule } from '@libs/common/common/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Config } from '@libs/common/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@libs/common/common/guard/auth.guard';

@Module({
  imports: [
    PlaylistModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    DatabaseModule,
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
          name: Config.TRACK_SERVICE,
          transport: Transport.REDIS,
          options: {
            host: Config.REDIS_HOST,
            port: Config.REDIS_PORT,
          },
        },
      ],
    }),
    JwtModule.register({
      secret: Config.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: Config.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
