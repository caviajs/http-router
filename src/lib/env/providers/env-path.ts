import path from 'path';
import { ValueProvider } from '../../ioc/types/provider';
import { Token } from '../../ioc/types/token';

export const ENV_PATH: Token<EnvPath> = Symbol('ENV_PATH');

export const EnvPathProvider: ValueProvider<EnvPath> = {
  provide: ENV_PATH,
  useValue: path.join(process.cwd(), '.env'),
};

export type EnvPath = string;
