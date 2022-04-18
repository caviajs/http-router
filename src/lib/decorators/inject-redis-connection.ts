import { Inject } from './inject';
import { getRedisConnectionToken } from '../providers/redis-connection';

export function InjectRedisConnection(name: string): ParameterDecorator {
  return Inject(getRedisConnectionToken(name));
}
