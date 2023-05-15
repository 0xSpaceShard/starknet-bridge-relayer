import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { json, simple } from './format';
import { ConfigModule, ConfigService, LogFormat } from 'common/config';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const level = configService.get('LOG_LEVEL');
        const format = configService.get('LOG_FORMAT');
        const isJSON = format === LogFormat.json;
        const transports = new winston.transports.Console({ format: isJSON ? json() : simple() });
        return { level, transports };
      },
    }),
  ],
})
export class LoggerModule {}
