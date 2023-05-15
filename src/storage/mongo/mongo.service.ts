import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { IStorage } from 'storage/storage.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { relayerMetadataId } from './mongo.constants';
import { RelayerMetadata } from 'storage/dto/relayer';
import { RelayerMetadataDocument, RelayerMetadataSchema } from './schemas/relayer-metadata';

@Injectable()
export class MongoService implements IStorage, OnModuleDestroy {
  constructor(@InjectModel(RelayerMetadataSchema.name) private relayerMetadataModel: Model<RelayerMetadataDocument>) {}

  async updateProcessedBlock(newBlockNumber: number) {
    let query = { _id: new ObjectId(relayerMetadataId) };
    const res = await this.relayerMetadataModel
      .updateOne(query, { $set: { blockNumber: newBlockNumber }, $setOnInsert: query }, { upsert: true })
      .exec();
    return res;
  }

  async getLastProcessedBlock(): Promise<RelayerMetadata> {
    let query = { _id: new ObjectId(relayerMetadataId) };
    const res = await this.relayerMetadataModel.findOne(query).exec();
    return {
      id: relayerMetadataId,
      blockNumber: res?.blockNumber,
    };
  }

  async onModuleDestroy() {
    await this.relayerMetadataModel.db.close();
  }
}
