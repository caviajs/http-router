import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '../decorators/injectable';
import { join } from 'path';

@Injectable()
export class Env {
  protected readonly variables: { readonly [name: string]: string; } = process.env;

  constructor() {
    const envPath: string = join(process.cwd(), '.env');

    if (fs.existsSync(envPath)) {
      this.variables = { ...this.variables, ...dotenv.parse(fs.readFileSync(envPath)) || {} };
    }
  }

  public get(name: string, defaultValue?: any): any {
    return this.variables[name] || defaultValue;
  }
}
