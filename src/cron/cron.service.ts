import { Injectable, LoggerService, Inject } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RelayerService } from 'relayer/relayer.service';

@Injectable()
export class CronService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly relayerService: RelayerService,
  ) {}

  @Timeout(20000)
  async relayer() {
    this.logger.log('Start the relayer job.');
    await this.relayerService.run();
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async relayerBalance() {
    await this.relayerService.checkRelayerBalance();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async highNetworkFees() {
    await this.relayerService.checkNetworkHighFees();
  }
}
