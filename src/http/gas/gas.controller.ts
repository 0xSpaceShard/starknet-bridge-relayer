import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GasService } from './gas.service';
import { ConfigService } from 'common/config';
import { networkListBridgeMetadata } from 'utils/bridgeTokens';
import { PrometheusService } from 'common/prometheus';

@Controller({
  path: 'gas-cost',
  version: '1',
})
export class GasController {
  constructor(
    private gasService: GasService,
    private configService: ConfigService,
    private readonly prometheusService: PrometheusService,
  ) {}

  @Get(':token/:timestamp')
  async getGasCostPerTimestamp(@Param('timestamp') timestamp: number, @Param('token') token: string) {
    const listBridgeMetadata = networkListBridgeMetadata(this.configService.get('NETWORK_ID'));
    if (!listBridgeMetadata[token.toLowerCase()]) {
      throw new BadRequestException('Token not handled');
    }

    try {
      const gasCost = (await this.gasService.getGasCostPerTimestamp(timestamp, token.toLowerCase())).toString();
      this.prometheusService.gasCostRequests.labels({method: "getGasCostPerTimestamp"}).inc();
      return {
        status: 'ok',
        message: 'success',
        result: {
          gasCost,
          timestamp,
          relayerAddress: this.configService.get('RELAYER_L2_ADDRESS'),
        },
      };
    } catch (error) {
      this.prometheusService.gasCostErrors.labels({method: "getGasCostPerTimestamp"}).inc();
      throw new InternalServerErrorException();
    }
  }
}
