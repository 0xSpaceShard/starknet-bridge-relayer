import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../src/common/config';
import { MongoService } from '../../src/storage/mongo/mongo.service';
import { MongoModule } from 'storage/mongo/mongo.module';

dotenv.config();
jest.useRealTimers();

describe('Relayer (e2e)', () => {
  let configService: ConfigService;
  let moduleFixture: TestingModule;
  let mongoService: MongoService;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [MongoModule],
    }).compile();
    mongoService = moduleFixture.get<MongoService>(MongoService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it('MongoService: test updateProcessedBlock and getLastProcessedBlock', async () => {
    const fromBlock = 786000;
    await mongoService.updateProcessedBlock(fromBlock);
    const lastProcessedBlock = await mongoService.getLastProcessedBlock();
    expect(lastProcessedBlock.blockNumber).toEqual(fromBlock);
  });
});
