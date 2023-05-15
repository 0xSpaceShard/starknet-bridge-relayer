import { Test, TestingModule } from '@nestjs/testing';
import { Web3Service } from './web3.service';
import { ConfigModule } from 'common/config';

describe('Web3Service', () => {
  let service: Web3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [Web3Service],
    }).compile();

    service = module.get<Web3Service>(Web3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Sucess encodeCalldataStarknetCore', () => {
    // Expected result: function l1ToL2Messages(bytes32)
    // bytes32 = 0000000000000000000000000000000000000000000000000000000000001000
    const expectedResult = '0x77c7d7a90000000000000000000000000000000000000000000000000000000000001000';
    const result = service.encodeCalldataStarknetCore('l1ToL2Messages', [
      '0x0000000000000000000000000000000000000000000000000000000000001000',
    ]);
    expect(result).toEqual(expectedResult);
  });
});
