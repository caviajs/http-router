import { FactoryProvider, Token } from '@caviajs/core';
import path from 'path';

export const ENV_PATH: Token<EnvPath> = Symbol('ENV_PATH');

export const envPathProvider: FactoryProvider<EnvPath> = {
  provide: ENV_PATH,
  useFactory: (): EnvPath => {
    return path.join(process.cwd(), '.env');
  },
};

export type EnvPath = string;
