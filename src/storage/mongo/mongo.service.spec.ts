import { Test, TestingModule } from '@nestjs/testing';
import { MongoService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createMock } from '@golevelup/ts-jest';
import { relayerMetadataId } from './mongo.constants';
import { RelayerMetadataDocument, RelayerMetadataSchema } from './schemas/relayer-metadata';

describe('MongoService', () => {
  let service: MongoService;
  let modelMock: Model<RelayerMetadataSchema>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule],
      providers: [
        MongoService,
        {
          provide: 'RelayerMetadataSchemaModel',
          useValue: createMock<RelayerMetadataDocument>(),
        },
      ],
    }).compile();

    modelMock = module.get<Model<any>>('RelayerMetadataSchemaModel');
    service = module.get<MongoService>(MongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Test updateProcessedBlock', async () => {
    const data = { ack: true, id: relayerMetadataId };

    jest.spyOn(modelMock, 'updateOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(data),
    } as any);

    const res = await service.updateProcessedBlock(100);
    expect(res).toEqual(data);
  });

  it('Test getLastProcessedBlock', async () => {
    const data = { id: relayerMetadataId, blockNumber: 100 };
    jest.spyOn(modelMock, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(data),
    } as any);
    const res = await service.getLastProcessedBlock();
    expect(res).toEqual(data);
  });
});
