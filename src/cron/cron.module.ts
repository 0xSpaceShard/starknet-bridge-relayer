import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { RelayerModule } from 'relayer/relayer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'common/logger';

@Module({
  imports: [ScheduleModule.forRoot(), RelayerModule, LoggerModule],
  providers: [CronService],
})
export class CronModule {}
