import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { TrackServiceModule } from './track-service.module';
import { Config } from '@libs/common/config';
import { HttpExceptions } from '@libs/common/exceptions/http.exception';
import { RedisOptions } from 'ioredis';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { ValidatorPipe } from '@libs/common/pipes/validator.pipe';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TrackServiceModule);

  // Setup Redis Microservice configuration
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379',
    },
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: [VERSION_NEUTRAL, '1'],
  });

  app.useGlobalPipes(ValidatorPipe());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptions(httpAdapterHost));
  await app.startAllMicroservices();

  
  await app.listen(Config.TRACK_PORT, Config.TRACK_HOST);
  console.log(`Server is running on ${Config.TRACK_HOST}:${Config.TRACK_PORT}`);
  console.log(`Application is running with base url of ${Config.TRACK_HOST}:${Config.TRACK_PORT}/api/v1`); 
  }
bootstrap();
