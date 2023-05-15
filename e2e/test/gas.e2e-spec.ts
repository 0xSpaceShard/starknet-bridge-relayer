import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../src/common/config';
import { GasModule, GasService } from '../../src/http/gas';

dotenv.config();
jest.useRealTimers();

describe('Relayer (e2e)', () => {
  let configService: ConfigService;
  let moduleFixture: TestingModule;
  let gasService: GasService;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [GasModule],
    }).compile();
    gasService = moduleFixture.get<GasService>(GasService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it.only('Should fetch block number by timestamp', async () => {
    expect(await gasService.fetchBlockNumberByTimestamp(1682836860 + 3600)).toEqual(8916425)
  });
});
