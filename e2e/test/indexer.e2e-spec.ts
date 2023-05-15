import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../src/common/config';
import { IndexerService } from '../../src/indexer/indexer.service';
import { IndexerModule } from '../../src/indexer/indexer.module';

dotenv.config();
jest.useRealTimers();

describe('Relayer (e2e)', () => {
  let configService: ConfigService;
  let moduleFixture: TestingModule;
  let indexerService: IndexerService;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [IndexerModule],
    }).compile();
    indexerService = moduleFixture.get<IndexerService>(IndexerService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it('IndexerService: getWithdraws', async () => {
    const limit = 5;
    const res = await indexerService.getWithdraws(limit, 0, 786000, 786005);
    expect(res.length).toEqual(limit);
  });

  it('IndexerService: getLastIndexedBlock', async () => {
    const lastProcessedBlock = await indexerService.getLastIndexedBlock();
    expect(lastProcessedBlock).toEqual(787000);
  });
});
