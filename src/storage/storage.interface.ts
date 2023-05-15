import { RelayerMetadata } from "./dto/relayer"

export interface IStorage {
    updateProcessedBlock(newBlockNumber: number): void
    getLastProcessedBlock(): Promise<RelayerMetadata>
}
