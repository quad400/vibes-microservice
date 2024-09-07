import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { ValidatorPipe } from 'libs/pipes/validator.pipe';
import { HttpExceptions } from 'libs/exceptions/http.exception';
import { Config } from 'libs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(Config.GATEWAY_PORT, Config.GATEWAY_HOST);
  console.log(`Server is running on ${Config.GATEWAY_HOST}:${Config.GATEWAY_PORT}`);
  console.log(`Application is running with base url of ${Config.GATEWAY_HOST}:${Config.GATEWAY_PORT}/api/v1`); 
}
bootstrap();
