import { Test, TestingModule } from '@nestjs/testing';
import { IndexerService } from './indexer.service';
import { GraphQLClientInject } from '@golevelup/nestjs-graphql-request';
import { getWithdrawalsMockResponse, requestWithdrawalsMock } from './__mocks__/request';

describe('IndexerService', () => {
  let service: IndexerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndexerService,
        {
          provide: GraphQLClientInject,
          useValue: requestWithdrawalsMock,
        },
      ],
    }).compile();

    service = module.get<IndexerService>(IndexerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Success get withdrawals', async () => {
    const res = await service.getWithdraws(1000, 0, 300000, 310000);
    expect(res.length).toEqual(getWithdrawalsMockResponse.withdraw.length);
  });

  it('Success get withdrawals', async () => {
    const res = await service.getWithdraws(1000, 0, 300000, 310000);
    expect(res.length).toEqual(getWithdrawalsMockResponse.withdraw.length);
  });
});
