import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { callWithRetry, sleep } from 'relayer/relayer.utils';
import { catchError, firstValueFrom } from 'rxjs';
import { BaseFeePerGasHistory } from 'web3/web3.interface';
import { Web3Service } from 'web3/web3.service';
import { BlockNumber24H, CacheDuration24hInMs, EtherscanApiUrl, FeeShiftPercentage, OneGwei } from './gas.constants';
import { AxiosError } from 'axios';
import { ConfigService } from 'common/config';
import { BigNumber } from 'ethers';
import { ceilBigNumber, clampTimestamp, roundBigNumber } from './gas.utils';
import { EtherscanGetBlockNumberTimestampResponse, FeeHistory } from './gas.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { networkListBridgeMetadata } from 'utils/bridgeTokens';
import { ListBridgeMetadata } from 'utils/interfaces';

@Injectable()
export class GasService {
  private readonly etherscanApiUrl: string;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private web3Service: Web3Service,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {
    this.etherscanApiUrl = EtherscanApiUrl(this.configService.get('NETWORK_ID'));
  }

  getGasCostPerTimestamp = async (timestamp: number, token: string): Promise<BigNumber> => {
    this.logger.log('Start calculate gas cost', { timestamp });
    const ctimestamp = clampTimestamp(timestamp);
    if (!ctimestamp) {
      this.logger.error('Invalid ctimestamp', { ctimestamp });
      new Error('Invalid ctimestamp');
    }

    // Block number
    let blockNumber: number = Number((await this.cacheManager.get(String(ctimestamp))) || 0);
    if (!blockNumber) {
      blockNumber = await this.fetchBlockNumberByTimestamp(ctimestamp);
      this.logger.log('Fetch blockNumber', { blockNumber, ctimestamp, timestamp });
      await this.cacheManager.set(String(ctimestamp), blockNumber, CacheDuration24hInMs);
    }

    if (!blockNumber) {
      this.logger.error('Invalid block number', { blockNumber });
      new Error('Invalid block number');
    }

    // base fees
    let gasCost: BigNumber = BigNumber.from(
      ((await this.cacheManager.get(`${String(blockNumber)}-${token}`)) as String) || '0',
    );
    if (gasCost.gt(0)) {
      this.logger.log('Use in memory gas cost', { gasCost });
      return gasCost;
    }

    this.logger.log('Fetch base fee price history', { token, timestamp, ctimestamp, blockNumber });
    const feeHistory = await this.fetchBaseFeePriceHistory(
      blockNumber,
      blockNumber - this.getNumberOfBlocksToCalculateTheGasCost(),
    );

    if (!feeHistory) {
      throw new Error('Invalid fee history');
    }

    const listBridgeMetadata: ListBridgeMetadata = networkListBridgeMetadata(this.configService.get('NETWORK_ID'));
    gasCost = await this.calculateGasCost(feeHistory, Number(listBridgeMetadata[token].gas));
    await this.cacheManager.set(`${String(blockNumber)}-${token}`, gasCost.toString(), CacheDuration24hInMs);
    this.logger.log('Calculate gas cost', { token, gasCost, blockNumber, ctimestamp, timestamp });

    return gasCost;
  };

  calculateGasCost = async (feeHistory: FeeHistory, gasUnit: number): Promise<BigNumber> => {
    let averageGasPrice = this.getAverageGasPrice(feeHistory.baseFees);
    if (averageGasPrice.lt(OneGwei * 10)) {
      averageGasPrice = BigNumber.from(String(OneGwei * 10));
    }
    return this.getGasCost(averageGasPrice, gasUnit);
  };

  getGasCost = (averageGasPrice: BigNumber, gasUnit: number): BigNumber => {
    return averageGasPrice.mul(String(gasUnit));
  };

  getAverageGasPrice = (baseFeePriceHistoryList: Array<String>) => {
    let totalBaseFeePrice = BigNumber.from('0');
    for (let i = 0; i < baseFeePriceHistoryList.length; i++) {
      totalBaseFeePrice = totalBaseFeePrice.add(BigNumber.from(baseFeePriceHistoryList[i]));
    }
    const averageBaseGasPrice = roundBigNumber(totalBaseFeePrice.div(baseFeePriceHistoryList.length));

    const averageBaseGasPriceCeil = ceilBigNumber(averageBaseGasPrice);
    return averageBaseGasPriceCeil.mul(100 + this.getFeeShiftPercentage()).div(100);
  };

  fetchBaseFeePriceHistory = async (lastBlockNumber: number, oldBlockNumber: number): Promise<FeeHistory> => {
    return await this.callWithRetry({
      callback: async () => {
        const feeHistory: FeeHistory = {
          lastBlock: lastBlockNumber,
          oldBlock: oldBlockNumber + 1,
          baseFees: [],
        };

        const limit = this.getLimit();
        const mod = oldBlockNumber % limit;
        let fromBlock = oldBlockNumber - mod + limit;
        const len = Math.ceil((lastBlockNumber - oldBlockNumber + mod) / limit);

        let currentBlockNumber: number;
        try {
          currentBlockNumber = await this.web3Service.getCurrentBlockNumber();
        } catch (error) {
          this.logger.error('Can not get block number', { error });
          throw new Error(`Can not get block number: ${error}`);
        }

        for (let i = 0; i < len; i++) {
          let baseFeePerGasHistory: BaseFeePerGasHistory = await this.cacheManager.get(String(fromBlock));
          if (!baseFeePerGasHistory?.baseFeePerGas) {
            await sleep(250);
            if (fromBlock > currentBlockNumber) {
              this.logger.log('Fetch fee data', {
                i,
                id: 1,
                from: lastBlockNumber,
                to: lastBlockNumber - (lastBlockNumber % limit),
                limit: lastBlockNumber % limit,
              });
              baseFeePerGasHistory = await this.web3Service.fetchBaseFeePriceHistory(
                lastBlockNumber,
                lastBlockNumber % limit,
              );
            } else {
              this.logger.log('Fetch fee data', {
                i,
                id: 2,
                from: fromBlock,
                to: fromBlock - limit,
                limit,
              });
              baseFeePerGasHistory = await this.web3Service.fetchBaseFeePriceHistory(fromBlock, limit);
              await this.cacheManager.set(String(fromBlock), baseFeePerGasHistory, CacheDuration24hInMs);
            }
          } else {
            this.logger.log('Use on memory fee data', {
              i,
              from: fromBlock,
              to: fromBlock - limit,
              limit,
            });
          }

          if (mod > 0 && i == 0) {
            feeHistory.baseFees.push(...baseFeePerGasHistory.baseFeePerGas.slice(mod, limit));
          } else if (mod > 0 && i == len - 1) {
            feeHistory.baseFees.push(...baseFeePerGasHistory.baseFeePerGas.slice(0, lastBlockNumber % limit));
          } else {
            feeHistory.baseFees.push(...baseFeePerGasHistory.baseFeePerGas.slice(0, limit));
          }
          fromBlock = fromBlock + limit;
        }

        if (feeHistory.baseFees.length !== lastBlockNumber - oldBlockNumber) {
          this.logger.error('Invalid Base gas data', {
            feeHistoryLength: feeHistory.baseFees.length,
            expectedLength: lastBlockNumber - oldBlockNumber,
          });
          throw new Error('Invalid Base gas data');
        }
        return feeHistory;
      },
      errorCallback: (error: any) => {
        this.logger.error('Error to get base fee price history:', error);
      },
    });
  };

  fetchBlockNumberByTimestamp = async (timestamp: number): Promise<number> => {
    return await this.callWithRetry({
      callback: async () => {
        await sleep(1000);
        const res = await firstValueFrom(
          this.httpService
            .get<EtherscanGetBlockNumberTimestampResponse>(
              `${
                this.etherscanApiUrl
              }?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${this.configService.get(
                'ETHERSCAN_API_KEY',
              )}`,
            )
            .pipe(
              catchError((error: AxiosError) => {
                this.logger.error('Error to fetch block by timestamp', error.response.data);
                throw `Error to fetch block by timestamp, ${error.response.data}`;
              }),
            ),
        );

        if (res.status != 200) {
          this.logger.error('Error returned when fetch block by timestamp', res.data);
          throw `Error returned when fetch block by timestamp, ${res.data}`;
        }
        return Number(res.data.result);
      },
      errorCallback: (error: any) => {
        const errMessage = `Can not get data from etherscan api : ${error}`;
        this.logger.error(errMessage);
        throw errMessage;
      },
    });
  };

  async callWithRetry({ callback, errorCallback }: { callback: Function; errorCallback: Function }) {
    return await callWithRetry(3, 2000, callback, errorCallback);
  }

  getNumberOfBlocksToCalculateTheGasCost = (): number => {
    return BlockNumber24H;
  };

  getLimit = (): number => {
    return 1000;
  };

  getFeeShiftPercentage = (): number => {
    return FeeShiftPercentage;
  };
}
