import { Test, TestingModule } from '@nestjs/testing';
import { GasController } from './gas.controller';
import { GasService } from './gas.service';
import { ConfigService } from 'common/config';
import { createMock } from '@golevelup/ts-jest';
import { BigNumber } from 'ethers';
import { ServiceUnavailableException } from '@nestjs/common';

describe('GasController', () => {
  let controller: GasController;
  let gasService: GasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GasController],
      providers: [
        ConfigService,
        {
          provide: GasService,
          useValue: createMock(),
        },
      ],
    }).compile();

    controller = module.get<GasController>(GasController);
    gasService = module.get<GasService>(GasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return gas cost', async () => {
    const gasCost = BigNumber.from('29500000000000');
    const timestamp = 1669087968;

    jest
      .spyOn(gasService, 'getGasCostPerTimestamp')
      .mockImplementation(async (timestamp: number): Promise<BigNumber> => {
        expect(timestamp).toEqual(1669087968);
        return gasCost;
      });
    const res = await controller.getGasCostPerTimestamp(
      timestamp,
      '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
    );
    expect(res.status).toEqual('ok');
    expect(res.message).toEqual('success');
    expect(res.result.gasCost).toEqual(gasCost.toString());
    expect(res.result.timestamp).toEqual(timestamp);
  });

  it('Should fail to return gas cost', async () => {
    jest
      .spyOn(gasService, 'getGasCostPerTimestamp')
      .mockImplementation(async (timestamp: number): Promise<BigNumber> => {
        throw new Error('Error to calculate gas cost');
      });

    const timestamp = 1669087968;
    try {
      await controller.getGasCostPerTimestamp(
        timestamp,
        '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
      );
    } catch (error) {
      expect(error.status).toEqual(500);
    }
  });
});
