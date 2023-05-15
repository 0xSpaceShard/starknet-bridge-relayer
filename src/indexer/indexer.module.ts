import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { GraphQLRequestModule } from '@golevelup/nestjs-graphql-request';
import { ConfigModule, ConfigService } from 'common/config';

@Module({
  providers: [IndexerService],
  imports: [
    ConfigModule,
    GraphQLRequestModule.forRootAsync(GraphQLRequestModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endpoint: configService.get('INDEXER_URL'),
      }),
    }),
  ],
  exports: [IndexerService]
})
export class IndexerModule {}
