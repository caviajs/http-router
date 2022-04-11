import { Schema, validate } from 'jtd';
import { Injectable } from '../decorators/injectable';

@Injectable()
export class Validator {
  public async validate(schema: Schema, data: any): Promise<ValidateResult> {
    return { errors: validate(schema, data) };
  }
}

export interface ValidateError {
  instancePath: string[];
  schemaPath: string[];
}

export interface ValidateResult {
  errors: ValidateError[];
}
