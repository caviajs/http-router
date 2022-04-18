import Redis from 'ioredis';
import { EventEmitter } from 'events';
import { getRedisConnectionOptionsToken, RedisConnectionOptions } from './redis-connection-options';
import { Token } from '../types/token';
import { FactoryProvider } from '../types/provider';

export function createRedisConnectionProvider(
  connectionName: string,
): FactoryProvider<Promise<RedisConnection>> {
  return {
    provide: getRedisConnectionToken(connectionName),
    useFactory: async (redisConnectionOptions: RedisConnectionOptions): Promise<RedisConnection> => {
      return new Redis(redisConnectionOptions);
    },
    dependencies: [getRedisConnectionOptionsToken(connectionName)],
  };
}

export function getRedisConnectionToken(connectionName: string): Token<RedisConnection> {
  return `redis-connection-${ connectionName }`;
}

export type RedisConnection = Omit<Redis, keyof EventEmitter>;
