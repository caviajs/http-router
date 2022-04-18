import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Inject } from '../decorators/inject';
import { Injectable } from '../decorators/injectable';
import { ENV_PATH, EnvPath } from './env-path';

@Injectable()
export class Env {
  protected readonly variables: { readonly [name: string]: string; } = process.env;

  constructor(
    @Inject(ENV_PATH) protected readonly envPath: EnvPath,
  ) {
    if (fs.existsSync(envPath)) {
      this.variables = { ...this.variables, ...dotenv.parse(fs.readFileSync(envPath)) || {} };
    }
  }

  public get(name: string, defaultValue?: any): any {
    return this.variables[name] || defaultValue;
  }
}
