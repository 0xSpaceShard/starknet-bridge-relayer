import { getOrCreateMetric } from '@willsoto/nestjs-prometheus';
import { Options, Metrics, Metric } from './prometheus.interface';
import { METRICS_PREFIX } from './prometheus.constants';

export class PrometheusService {
  protected prefix = METRICS_PREFIX;

  protected getOrCreateMetric<T extends Metrics, L extends string>(type: T, options: Options<L>): Metric<T, L> {
    const prefixedName = options.prefix ? this.prefix + options.name : options.name;

    return getOrCreateMetric(type, {
      ...options,
      name: prefixedName,
    }) as Metric<T, L>;
  }

  public httpRequestDuration = this.getOrCreateMetric('Histogram', {
    prefix: false,
    name: 'http_requests_duration_seconds',
    help: 'Duration of http requests',
    buckets: [0.01, 0.1, 0.2, 0.5, 1, 1.5, 2, 5],
    labelNames: ['statusCode', 'method'],
  });

  public buildInfo = this.getOrCreateMetric('Gauge', {
    prefix: false,
    name: 'build_info',
    help: 'Build information',
    labelNames: ['name', 'version', 'env'],
  });

  public indexerRequests = this.getOrCreateMetric('Counter', {
    prefix: true,
    name: 'indexer_requests',
    help: 'Indexer success requests',
    labelNames: ['method'],
  });

  public indexerErrors = this.getOrCreateMetric('Counter', {
    prefix: true,
    name: 'indexer_errors',
    help: 'Indexer failed requests',
    labelNames: ['method'],
  });

  public web3Requests = this.getOrCreateMetric('Counter', {
    prefix: true,
    name: 'web3_requests',
    help: 'Web3 success requests',
    labelNames: ['method'],
  });

  public web3ConsumeMessageRequests = this.getOrCreateMetric('Counter', {
    prefix: true,
    name: 'web3_consume_message_requests',
    help: 'Web3 consume message success requests',
    labelNames: ['method', 'txHash'],
  });

  public web3Errors = this.getOrCreateMetric('Counter', {
    prefix: true,
    name: 'web3_errors',
    help: 'Web3 failed requests',
    labelNames: ['method'],
  });

  public storageRequests = this.getOrCreateMetric('Counter', {
    prefix: true,
    name: 'storage_requests',
    help: 'Storage success requests',
    labelNames: ['method'],
  });

  public storageErrors = this.getOrCreateMetric('Counter', {
    prefix: true,
    name: 'storage_errors',
    help: 'Storage failed requests',
    labelNames: ['method'],
  });
}
