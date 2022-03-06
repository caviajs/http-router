import { Token, ValueProvider } from '@caviajs/core';
import path from 'path';

export const ENV_PATH: Token<EnvPath> = Symbol('ENV_PATH');

export const envPathProvider: ValueProvider<EnvPath> = {
  provide: ENV_PATH,
  useValue: path.join(process.cwd(), '.env'),
};

export type EnvPath = string;
