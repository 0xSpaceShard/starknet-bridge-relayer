import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RelayerMetadataDocument = RelayerMetadataSchema & Document;

@Schema()
export class RelayerMetadataSchema {
  @Prop()
  blockNumber: number;
}

export const relayerMetadataSchema = SchemaFactory.createForClass(RelayerMetadataSchema);
