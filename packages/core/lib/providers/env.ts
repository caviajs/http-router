import * as dotenv from 'dotenv';
import * as fs from 'fs';
import get from 'lodash.get';
import { Inject } from '../decorators/inject';
import { Injectable } from '../decorators/injectable';
import { ENV_PATH, EnvPath } from './env-path';

@Injectable()
export class Env {
  protected readonly variables: { [name: string]: string; } = process.env;

  constructor(
    @Inject(ENV_PATH) private readonly envPath: EnvPath,
  ) {
    if (fs.existsSync(envPath)) {
      this.variables = { ...this.variables, ...dotenv.parse(fs.readFileSync(envPath)) || {} };
    }
  }

  public get(name: string, defaultValue?: any): any {
    return get(this.variables, name, defaultValue);
  }
}
