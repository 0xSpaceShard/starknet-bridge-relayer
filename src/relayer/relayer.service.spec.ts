import { Test, TestingModule } from '@nestjs/testing';
import { RelayerService } from './relayer.service';
import { MongoService } from 'storage/mongo/mongo.service';
import { Web3Service } from 'web3/web3.service';
import { ConfigService } from 'common/config';
import { Web3ServiceMock } from './__mocks__/Web3Service_mock';
import { MongoServiceMock, MongoServiceMockData } from './__mocks__/MongoService_mock';
import { IndexerService } from 'indexer/indexer.service';
import { IndexerServiceMock, NumberOfTimesReceivedDataFromIndexerMock } from './__mocks__/IndexerService_mock';
import {
  canConsumeMessageOnL1MulticallViewResponseExpectedOutput,
  fromBlockNumberMock,
  toBlockNumberMock,
  withdrawalsResponseMock,
} from './__mocks__/data';
import { l2BridgeAddressToL1 } from './relayer.constants';
import { MulticallResponse } from 'web3/web3.interface';

describe.only('RelayerService', () => {
  let service: RelayerService;
  let web3Service: Web3Service;
  const verbose = false;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelayerService,
        ConfigService,
        {
          provide: MongoService,
          useValue: MongoServiceMock,
        },
        {
          provide: Web3Service,
          useValue: Web3ServiceMock,
        },
        {
          provide: IndexerService,
          useValue: IndexerServiceMock,
        },
        {
          provide: 'NestWinston',
          useValue: {
            log: jest.fn((message: string, params: []) => {
              if (verbose) {
                console.log('INFO:', message, params);
              }
            }),
            error: jest.fn((message: string, params: []) => {
              if (verbose) {
                console.log('ERROR:', message, params);
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RelayerService>(RelayerService);
    web3Service = module.get<Web3Service>(Web3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Success get the message hash to consume on L1', () => {
    const expectedHash = '0x09af67e5cf9937ebef036cbc33dad018a89ceb14c14928fe38823cf548a7180b';
    const l2BridgeAddress = '0x72eeb90833bae233a9585f2fa9afc99c187f0a3a82693becd6a4d700b37fc6b';
    const l1BridgeAddress = '0xf29aE3446Ce4688fCc792b232C21D1B9581E7baC';
    const l1ReceiverAddress = '0x0000000000000000000000000000000000000001';
    const amount = '100';
    const messagehash = service.getMessageHash(l2BridgeAddress, l1BridgeAddress, l1ReceiverAddress, amount);
    expect(messagehash).toEqual(expectedHash);
  });

  it('Success getLastProcessedBlock', async () => {
    expect(await service.getLastProcessedBlock()).toEqual(MongoServiceMockData.getLastProcessedBlock.blockNumber);
  });

  it('Success getRequestWithdrawalAtBlocks', async () => {
    const res = await service.getRequestWithdrawalAtBlocks(fromBlockNumberMock, toBlockNumberMock);
    expect(res.withdrawals.length).toEqual(withdrawalsResponseMock.length * NumberOfTimesReceivedDataFromIndexerMock);
    expect(res.fromBlock).toEqual(fromBlockNumberMock);
    expect(res.toBlock).toEqual(toBlockNumberMock);
  });

  it('Success getMulticallRequests', async () => {
    const withdrawalAtBlocksResponse = await service.getRequestWithdrawalAtBlocks(
      fromBlockNumberMock,
      toBlockNumberMock,
    );
    const res = await service.getMulticallRequests(withdrawalAtBlocksResponse.withdrawals);
    expect(res.length).toEqual(withdrawalAtBlocksResponse.withdrawals.length);
    const l2BridgeAddressToL1Addresses = l2BridgeAddressToL1('goerli');
    for (let i = 0; i < res.length; i++) {
      const req = res[i];
      const l1BridgeAddress =
        l2BridgeAddressToL1Addresses[withdrawalAtBlocksResponse.withdrawals[i].bridgeAddress].l1BridgeAddress;
      expect(req.target).toEqual(l1BridgeAddress);
      // Example: calldata = 0xa46efaf3c96dbee3b8d1478353813a10f1c9b396c187e8fa71cd80902b5005edb62d9b28
      // a46efaf3 => function selector => 4Bytes
      // messageHash => c96dbee3b8d1478353813a10f1c9b396c187e8fa71cd80902b5005edb62d9b28 => 32Bytes
      // total => 36 bytes (72 characters)
      expect(req.callData.replace('0x', '').length).toEqual(72);
    }
  });

  it('Success getListOfValidMessagesToConsumedOnL1', async () => {
    const withdrawalAtBlocksResponse = await service.getRequestWithdrawalAtBlocks(
      fromBlockNumberMock,
      toBlockNumberMock,
    );
    const allMulticallRequests = await service.getMulticallRequests(withdrawalAtBlocksResponse.withdrawals);
    const viewMulticallResponse: MulticallResponse = await web3Service.canConsumeMessageOnL1MulticallView(
      allMulticallRequests,
    );
    const allMulticallRequestsForMessagesCanBeConsumedOnL1 = service.getListOfValidMessagesToConsumedOnL1(
      viewMulticallResponse,
      allMulticallRequests,
    );

    expect(allMulticallRequestsForMessagesCanBeConsumedOnL1.length).toEqual(
      canConsumeMessageOnL1MulticallViewResponseExpectedOutput.valid,
    );
  });

  it('Success getListOfValidMessagesToConsumedOnL1', async () => {
    const withdrawalAtBlocksResponse = await service.getRequestWithdrawalAtBlocks(
      fromBlockNumberMock,
      toBlockNumberMock,
    );
    const allMulticallRequests = await service.getMulticallRequests(withdrawalAtBlocksResponse.withdrawals);
    const viewMulticallResponse: MulticallResponse = await web3Service.canConsumeMessageOnL1MulticallView(
      allMulticallRequests,
    );
    const allMulticallRequestsForMessagesCanBeConsumedOnL1 = service.getListOfValidMessagesToConsumedOnL1(
      viewMulticallResponse,
      allMulticallRequests,
    );

    await service.consumeMessagesOnL1(allMulticallRequestsForMessagesCanBeConsumedOnL1);
  });

  it('Success processWithdrawals', async () => {
    const res = await service.processWithdrawals(fromBlockNumberMock, toBlockNumberMock);
    expect(res.currentFromBlockNumber).toEqual(toBlockNumberMock);
    // Check the file `IndexerServiceMock->getWithdraws->TestCase-5` inside __mocks__
    expect(res.totalWithdrawals).toEqual(10);
    expect(res.totalWithdrawalsProcessed).toEqual(4);
  });

  it('Success checkIfUserPaiedTheRelayer', () => {
    let isValid = service.checkIfUserPaiedTheRelayer([
      {
        from_: '0x',
        to: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '100',
      },
    ]);
    expect(isValid).toEqual(true);

    isValid = service.checkIfUserPaiedTheRelayer([
      {
        from_: '0x',
        to: '0x0000000000000000000000000000000000000000000000000000000000000020',
        value: '100',
      },
    ]);
    expect(isValid).toEqual(false);
  });

  it('Success callWithRetry', async () => {
    const errorMessage = 'Error to process';
    expect(async () => {
      try {
        await service.callWithRetry({
          callback: () => {
            throw errorMessage;
          },
          errorCallback: (error: any) => {
            throw error;
          },
        });
      } catch (error: any) {
        expect(error).toEqual(errorMessage);
      }
    });
  });
});