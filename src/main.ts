import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from 'common/config';
import { VersioningType } from '@nestjs/common';
import { SWAGGER_URL } from 'http/common/swagger';
import { AppModule, APP_DESCRIPTION, APP_VERSION } from 'app';
import { MetricsPrometheusModule } from 'common/prometheus/metrics.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }));
  const metrics = await NestFactory.create<NestFastifyApplication>(MetricsPrometheusModule, new FastifyAdapter());

  // config
  const configService: ConfigService = app.get(ConfigService);
  const appPort = configService.get('RELAYER_PORT');
  const metricsPort = configService.get('METRICS_PORT');

  app.enableVersioning({ type: VersioningType.URI });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors({
    origin: '*',
  });

  // swagger
  const swaggerConfig = new DocumentBuilder().setTitle(APP_DESCRIPTION).setVersion(APP_VERSION).build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_URL, app, swaggerDocument);

  metrics.listen(metricsPort, '0.0.0.0');
  await app.listen(appPort, '0.0.0.0');
}
bootstrap();
