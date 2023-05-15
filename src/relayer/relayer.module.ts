import { Module } from '@nestjs/common';
import { RelayerService } from './relayer.service';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from 'web3/web3.module';
import { MongoModule } from 'storage/mongo/mongo.module';
import { IndexerModule } from 'indexer/indexer.module';
import { LoggerModule } from 'common/logger';
import { PrometheusModule } from 'common/prometheus';
import { GasModule } from 'http/gas/gas.module';
import { DiscordModule } from 'notification/discord/discord.module';

@Module({
  imports: [LoggerModule, ConfigModule, Web3Module, MongoModule, IndexerModule, PrometheusModule, GasModule, DiscordModule],
  providers: [RelayerService],
  exports: [RelayerService]
})
export class RelayerModule {}
