import { Test, TestingModule } from '@nestjs/testing';
import { GasService } from './gas.service';
import { LoggerModule } from 'common/logger';
import { createMock } from '@golevelup/ts-jest';
import { ceilBigNumber, clampTimestamp, roundBigNumber } from './gas.utils';
import { BigNumber } from 'ethers';
import { OneGwei } from './gas.constants';
import {
  BaseFeePriceHistoryMock_7999500_7999001,
  BaseFeePriceHistoryMock_8000000_7999001,
  BaseFeePriceHistoryMock_8000000_7999501,
  BaseFeePriceHistoryMock_8000500_8000001,
} from './__mocks__/baseFeePricehistory';
import { Web3Service } from 'web3/web3.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FeeHistory } from './gas.interface';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheModule } from '@nestjs/cache-manager';

describe('GasService', () => {
  let service: GasService;
  let web3Service: Web3Service;

  const cacheStore = {};
  let useCache = false;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        GasService,
        ConfigService,
        Web3Service,
        {
          provide: 'NestWinston',
          useValue: createMock(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: (input: any) => {
              cacheStore[input];
              return useCache ? cacheStore[input] : null;
            },
            set: (key: any, value: any, time: any) => {
              cacheStore[key] = value;
            },
          },
        },
      ],
    }).compile();

    service = module.get<GasService>(GasService);
    web3Service = module.get<Web3Service>(Web3Service);
    // cacheService = module.get<CacheModule>(CacheModule);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Success Gas cost', async () => {
    const average = BigNumber.from((150 * 1e9).toString());
    const avgGas = service.getGasCost(average, 50000);
    expect(avgGas).toEqual(average.mul(50000));

    const avgGasPrice = service.getAverageGasPrice(BaseFeePriceHistoryMock_8000000_7999001.baseFeePerGas);
    expect(avgGasPrice.mod(5).toNumber()).toEqual(0);
  });

  it('Success fetchBaseFeePriceHistory', async () => {
    const startBlockNumber = 200000;
    const oldBlockNumber = 199000;
    const limit = 1000;
    jest.spyOn(service, 'getLimit').mockReturnValue(limit);
    jest.spyOn(web3Service, 'getCurrentBlockNumber').mockReturnValue(Promise.resolve(9000000));
    jest.spyOn(web3Service, 'fetchBaseFeePriceHistory').mockImplementation(async (fromBlock: number, lim: number) => {
      expect(fromBlock).toEqual(startBlockNumber);
      expect(lim).toEqual(limit);
      return BaseFeePriceHistoryMock_8000000_7999001;
    });
    const res: FeeHistory = await service.fetchBaseFeePriceHistory(startBlockNumber, oldBlockNumber);
    expect(res.lastBlock).toEqual(startBlockNumber);
    expect(res.oldBlock).toEqual(oldBlockNumber + 1);
    expect(res.baseFees.length).toEqual(BaseFeePriceHistoryMock_8000000_7999001.baseFeePerGas.length - 1);

    const baseFeePerGas = BaseFeePriceHistoryMock_8000000_7999001.baseFeePerGas.slice(0, -1);
    for (let i = 0; i < res.baseFees.length; i++) {
      const fee = res.baseFees[i];
      expect(fee).toEqual(baseFeePerGas[i]);
    }
  });

  it('Success fetchBaseFeePriceHistory with pagination <200000-199000>', async () => {
    const startBlockNumber = 200000;
    const oldBlockNumber = 199000;
    const limit = 500;
    jest.spyOn(service, 'getLimit').mockReturnValue(limit);
    jest.spyOn(web3Service, 'getCurrentBlockNumber').mockReturnValue(Promise.resolve(9000000));
    jest
      .spyOn(web3Service, 'fetchBaseFeePriceHistory')
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(oldBlockNumber + limit);
        expect(lim).toEqual(limit);
        return {
          baseFeePerGas: BaseFeePriceHistoryMock_7999500_7999001.baseFeePerGas,
          gasUsedRatio: [],
          oldestBlock: BigNumber.from(String(oldBlockNumber)).toHexString(),
        };
      })
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(startBlockNumber);
        expect(lim).toEqual(limit);
        return {
          baseFeePerGas: BaseFeePriceHistoryMock_8000000_7999501.baseFeePerGas,
          gasUsedRatio: [],
          oldestBlock: BigNumber.from(String(oldBlockNumber)).toHexString(),
        };
      });
    const res: FeeHistory = await service.fetchBaseFeePriceHistory(startBlockNumber, oldBlockNumber);
    expect(res.lastBlock).toEqual(startBlockNumber);
    expect(res.oldBlock).toEqual(oldBlockNumber + 1);
    expect(res.baseFees.length).toEqual(BaseFeePriceHistoryMock_8000000_7999001.baseFeePerGas.length - 1);

    const baseFeePerGas = BaseFeePriceHistoryMock_8000000_7999001.baseFeePerGas.slice(0, -1);
    for (let i = 0; i < res.baseFees.length; i++) {
      const fee = res.baseFees[i];
      expect(fee).toEqual(baseFeePerGas[i]);
    }
  });

  it('Success fetchBaseFeePriceHistory with pagination <200020-199020>', async () => {
    const startBlockNumber = 200020;
    const oldBlockNumber = 199020;
    const limit = 500;
    const oldBlockNumberMod = oldBlockNumber % 500;
    jest.spyOn(service, 'getLimit').mockReturnValue(limit);
    jest.spyOn(web3Service, 'getCurrentBlockNumber').mockReturnValue(Promise.resolve(9000000));
    jest
      .spyOn(web3Service, 'fetchBaseFeePriceHistory')
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(oldBlockNumber - oldBlockNumberMod + limit);
        expect(lim).toEqual(limit);
        return {
          baseFeePerGas: BaseFeePriceHistoryMock_7999500_7999001.baseFeePerGas,
          gasUsedRatio: [],
          oldestBlock: BigNumber.from(String(oldBlockNumber)).toHexString(),
        };
      })
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(oldBlockNumber - oldBlockNumberMod + limit * 2);
        expect(lim).toEqual(limit);
        return {
          baseFeePerGas: BaseFeePriceHistoryMock_8000500_8000001.baseFeePerGas,
          gasUsedRatio: [],
          oldestBlock: BigNumber.from(String(oldBlockNumber)).toHexString(),
        };
      })
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(oldBlockNumber - oldBlockNumberMod + limit * 3);
        expect(lim).toEqual(limit);
        return {
          baseFeePerGas: BaseFeePriceHistoryMock_8000000_7999501.baseFeePerGas,
          gasUsedRatio: [],
          oldestBlock: BigNumber.from(String(oldBlockNumber)).toHexString(),
        };
      });

    jest.spyOn(service, 'getNumberOfBlocksToCalculateTheGasCost').mockReturnValue(1000);

    const res: FeeHistory = await service.fetchBaseFeePriceHistory(startBlockNumber, oldBlockNumber);
    expect(res.lastBlock).toEqual(startBlockNumber);
    expect(res.oldBlock).toEqual(oldBlockNumber + 1);
    expect(res.baseFees.length).toEqual(startBlockNumber - oldBlockNumber);

    const baseFeePerGas = [
      ...BaseFeePriceHistoryMock_7999500_7999001.baseFeePerGas.slice(oldBlockNumberMod, -1),
      ...BaseFeePriceHistoryMock_8000500_8000001.baseFeePerGas.slice(0, -1),
      ...BaseFeePriceHistoryMock_8000000_7999501.baseFeePerGas.slice(0, -(limit - oldBlockNumberMod + 1)),
    ];
    for (let i = 0; i < res.baseFees.length; i++) {
      const fee = res.baseFees[i];
      expect(fee).toEqual(baseFeePerGas[i]);
    }
  });

  it('Success roundBigNumber', async () => {
    const testCases = [
      {
        input: BigNumber.from((123456789123).toString()),
        output: BigNumber.from((123 * OneGwei).toString()),
      },
      {
        input: BigNumber.from((23456789123).toString()),
        output: BigNumber.from((23 * OneGwei).toString()),
      },
    ];
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      expect(roundBigNumber(testCase.input).toString()).toEqual(testCase.output.toString());
    }
  });

  it('Success ceilBigNumber', async () => {
    const testCases = [
      {
        input: BigNumber.from((129 * OneGwei).toString()),
        output: BigNumber.from((130 * OneGwei).toString()),
      },
      {
        input: BigNumber.from((123 * OneGwei).toString()),
        output: BigNumber.from((125 * OneGwei).toString()),
      },
      {
        input: BigNumber.from((23 * OneGwei).toString()),
        output: BigNumber.from((25 * OneGwei).toString()),
      },
      {
        input: BigNumber.from((27 * OneGwei).toString()),
        output: BigNumber.from((30 * OneGwei).toString()),
      },
      {
        input: BigNumber.from((20 * OneGwei).toString()),
        output: BigNumber.from((20 * OneGwei).toString()),
      },
      {
        input: BigNumber.from((24 * OneGwei).toString()),
        output: BigNumber.from((25 * OneGwei).toString()),
      },
    ];
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      expect(ceilBigNumber(testCase.input).toString()).toEqual(testCase.output.toString());
    }
  });

  it('Success clampTimestamp', async () => {
    const testCases = [
      {
        input: 1682492857,
        output: 1682491500,
      },
      {
        input: 1682488260,
        output: 1682487000,
      },
      {
        input: 1682486978,
        output: 1682485200,
      },
      {
        input: 1682486040,
        output: 1682484300,
      },
    ];
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      expect(clampTimestamp(testCase.input)).toEqual(testCase.output);
    }
  });

  it('Success getGasCostPerTimestamp', async () => {
    let startBlockNumber = 8000000;
    let limit = 1000;
    jest.spyOn(service, 'getLimit').mockReturnValueOnce(limit);
    jest.spyOn(service, 'fetchBlockNumberByTimestamp').mockReturnValue(Promise.resolve(startBlockNumber));
    jest.spyOn(service, 'getNumberOfBlocksToCalculateTheGasCost').mockReturnValue(limit);
    jest.spyOn(web3Service, 'getCurrentBlockNumber').mockReturnValue(Promise.resolve(9000000));

    jest
      .spyOn(web3Service, 'fetchBaseFeePriceHistory')
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(startBlockNumber);
        expect(lim).toEqual(limit);
        return BaseFeePriceHistoryMock_8000000_7999001;
      });

    const avgGasCost1 = await service.getGasCostPerTimestamp(1669087968, "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82");
    expect(avgGasCost1.mod(5).toNumber()).toEqual(0);

    limit = 500;
    jest.spyOn(service, 'getLimit').mockReturnValue(limit);
    jest
      .spyOn(web3Service, 'fetchBaseFeePriceHistory')
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(startBlockNumber - limit);
        expect(lim).toEqual(limit);
        return BaseFeePriceHistoryMock_7999500_7999001;
      })
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(startBlockNumber);
        expect(lim).toEqual(limit);
        return BaseFeePriceHistoryMock_8000000_7999501;
      });
    const avgGasCost2 = await service.getGasCostPerTimestamp(1669087968, "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82");
    expect(avgGasCost2.mod(5).toNumber()).toEqual(0);
    expect(avgGasCost1).toEqual(avgGasCost2);
  });

  it('Success getGasCostPerTimestamp when current block number is bigger than the from block', async () => {
    let startBlockNumber = 8000100;
    let limit = 500;
    jest.spyOn(service, 'getLimit').mockReturnValueOnce(limit);
    jest.spyOn(service, 'fetchBlockNumberByTimestamp').mockReturnValue(Promise.resolve(startBlockNumber));
    jest.spyOn(service, 'getNumberOfBlocksToCalculateTheGasCost').mockReturnValue(1000);
    jest.spyOn(web3Service, 'getCurrentBlockNumber').mockReturnValue(Promise.resolve(8000120));

    jest
      .spyOn(web3Service, 'fetchBaseFeePriceHistory')
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(7999500);
        expect(lim).toEqual(limit);
        return BaseFeePriceHistoryMock_7999500_7999001;
      })
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(8000000);
        expect(lim).toEqual(limit);
        return BaseFeePriceHistoryMock_8000000_7999501;
      })
      .mockImplementationOnce(async (fromBlock: number, lim: number) => {
        expect(fromBlock).toEqual(startBlockNumber);
        expect(lim).toEqual(100);
        return {
          baseFeePerGas: BaseFeePriceHistoryMock_8000500_8000001.baseFeePerGas.slice(0, 102),
          gasUsedRatio: BaseFeePriceHistoryMock_8000500_8000001.gasUsedRatio,
          oldestBlock: BaseFeePriceHistoryMock_8000500_8000001.oldestBlock,
        };
      });

    const avgGasCost1 = await service.getGasCostPerTimestamp(1669087968, "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82");
    expect(avgGasCost1.mod(5).toNumber()).toEqual(0);
  });

  it('Success getAverageGasPrice', async () => {
    jest.spyOn(service, 'getFeeShiftPercentage').mockReturnValue(0);
    let avgGasPrice = service.getAverageGasPrice(['1000000000000', '1000000000000', '1000000000000']);
    expect(avgGasPrice.toString()).toEqual(BigNumber.from('1000000000000').toString());

    jest.spyOn(service, 'getFeeShiftPercentage').mockReturnValue(20);
    avgGasPrice = service.getAverageGasPrice(['1000000000000', '1000000000000', '1000000000000']);
    expect(avgGasPrice.toString()).toEqual(BigNumber.from('1200000000000').toString());
  });

  it('Success fetchBaseFeePriceHistory', async () => {
    const startBlockNumber = 200000;
    const oldBlockNumber = 199000;
    const limit = 1000;
    jest.spyOn(service, 'getLimit').mockReturnValue(limit);
    jest.spyOn(web3Service, 'getCurrentBlockNumber').mockImplementation(async (): Promise<number> => {
      throw 'Error to fetch block number';
    });

    try {
      await service.fetchBaseFeePriceHistory(startBlockNumber, oldBlockNumber);
    } catch (error) {
      expect(error).toEqual('Error to fetch block number');
    }
  });

  
});
