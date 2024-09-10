import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { Transport } from '@nestjs/microservices';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { ValidatorPipe } from 'libs/pipes/validator.pipe';
import { HttpExceptions } from 'libs/exceptions/http.exception';
import { Config } from 'libs/config';
import { RedisOptions } from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);

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

  
  await app.listen(Config.USER_PORT, Config.USER_HOST);
  console.log(`Server is running on ${Config.USER_HOST}:${Config.USER_PORT}`);
  console.log(`Application is running with base url of ${Config.USER_HOST}:${Config.USER_PORT}/api/v1`); 
  }
bootstrap();
