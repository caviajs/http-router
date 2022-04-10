import { Injectable } from '../decorators/injectable';

@Injectable()
export class Validator {
  public async validate(schema: any, data: any): Promise<ValidateResult> {
    return {
      errors: [],
    };
  }
}

export interface ValidateResult {
  errors: any[];
}
