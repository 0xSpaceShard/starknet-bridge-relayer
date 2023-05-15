import { Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from 'common/config';
import { RelayerMetadataSchema, relayerMetadataSchema } from './schemas/relayer-metadata';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: RelayerMetadataSchema.name, schema: relayerMetadataSchema }])
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
