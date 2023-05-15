import { CacheModule, Module } from '@nestjs/common';
import { GasService } from './gas.service';
import { LoggerModule } from 'common/logger';
import { HttpModule } from '@nestjs/axios';
import { Web3Module } from 'web3/web3.module';
import { ConfigModule } from 'common/config';
import { GasController } from './gas.controller';

@Module({
  imports: [
    LoggerModule,
    Web3Module,
    ConfigModule,
    CacheModule.register(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [GasService],
  exports: [GasService],
  controllers: [GasController],
})
export class GasModule {}
