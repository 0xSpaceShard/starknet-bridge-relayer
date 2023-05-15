import { Module } from '@nestjs/common';
import { HealthModule } from 'common/health';
import { ConfigModule } from 'common/config';
import { LoggerModule } from 'common/logger';
import { PrometheusModule } from 'common/prometheus';
import { HTTPModule } from '../http';
import { AppService } from './app.service';
import { CronModule } from 'cron/cron.module';

@Module({
  imports: [HTTPModule, HealthModule, LoggerModule, PrometheusModule, ConfigModule, CronModule],
  providers: [AppService],
})
export class AppModule {}
