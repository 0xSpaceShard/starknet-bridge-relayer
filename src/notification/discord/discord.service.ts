import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from 'common/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { INotificationService } from 'notification/notification';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DiscordService implements INotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  sendMessage = async (content: string) => {
    try {
      await lastValueFrom(this.httpService.post(this.configService.get('DISCORD_WEBHOOK_URL'), { content }));
    } catch (error) {
      this.loggerService.error('Error to send message to Discord', { error });
    }
  };
}
