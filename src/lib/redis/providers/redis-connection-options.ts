import * as ioredis from 'ioredis';
import { Token } from '../../ioc/types/token';
import { FactoryProvider } from '../../ioc/types/provider';

export function createRedisConnectionOptionsProvider(
  connectionName: string,
  redisConnectionOptionsFactory: RedisConnectionOptionsFactory,
  redisConnectionOptionsFactoryDependencies?: Token[],
): FactoryProvider<RedisConnectionOptions | Promise<RedisConnectionOptions>> {
  return {
    provide: getRedisConnectionOptionsToken(connectionName),
    useFactory: redisConnectionOptionsFactory,
    dependencies: redisConnectionOptionsFactoryDependencies,
  };
}

export function getRedisConnectionOptionsToken(connectionName: string): Token<RedisConnectionOptions> {
  return `redis-connection-options-${ connectionName }`;
}

export type RedisConnectionOptions = ioredis.RedisOptions;

export type RedisConnectionOptionsFactory = (...deps: any[]) => RedisConnectionOptions | Promise<RedisConnectionOptions>;
