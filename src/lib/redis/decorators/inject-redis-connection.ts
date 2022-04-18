import { Inject } from '../../ioc/decorators/inject';
import { getRedisConnectionToken } from '../providers/redis-connection';

export function InjectRedisConnection(name: string): ParameterDecorator {
  return Inject(getRedisConnectionToken(name));
}
