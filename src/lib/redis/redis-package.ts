import { Token } from '../ioc/types/token';
import { Package } from '../runtime/types/package';
import { createRedisConnectionProvider } from './providers/redis-connection';
import { createRedisConnectionOptionsProvider, RedisConnectionOptions, RedisConnectionOptionsFactory } from './providers/redis-connection-options';

export class RedisPackage {
  public static declareConnection(connectionName: string, optionsOrFactory?: RedisConnectionOptions): Package;
  public static declareConnection(connectionName: string, optionsOrFactory?: RedisConnectionOptionsFactory, dependencies?: Token[]): Package;
  public static declareConnection(connectionName: string, optionsOrFactory?: RedisConnectionOptions | RedisConnectionOptionsFactory, dependencies?: Token[]): Package {
    const factory: RedisConnectionOptionsFactory = typeof optionsOrFactory === 'function' ? optionsOrFactory : () => (optionsOrFactory || {});

    return {
      providers: [
        createRedisConnectionOptionsProvider(connectionName, factory, dependencies),
        createRedisConnectionProvider(connectionName),
      ],
    };
  }

  // declareClusterConnection ?
}
