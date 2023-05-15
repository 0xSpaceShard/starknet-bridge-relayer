import { APP_GUARD } from '@nestjs/core';
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { HEALTH_URL } from 'common/health';
import { METRICS_URL } from 'common/prometheus';

import { SWAGGER_URL } from './common/swagger';
import { ThrottlerModule, ThrottlerBehindProxyGuard } from './common/throttler';
import { MetricsMiddleware } from './common/middleware';
import { GasModule } from './gas/gas.module';

@Module({
  imports: [ThrottlerModule, GasModule],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard }],
})
export class HTTPModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .exclude(`${SWAGGER_URL}/(.*)`, SWAGGER_URL, METRICS_URL, HEALTH_URL)
      .forRoutes('*');
  }
}
