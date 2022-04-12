import { Injectable } from '../decorators/injectable';
import * as jtd from 'jtd';

@Injectable()
export class Validator {
  public validate(schema: Schema, data: any): ValidateResult {
    return { errors: jtd.validate(schema, data) };
  }
}

export interface ValidateError {
  instancePath: string[];
  schemaPath: string[];
}

export interface ValidateResult {
  errors: ValidateError[];
}

export type Schema = jtd.Schema;
