import { Injectable } from '../decorators/injectable';

@Injectable()
export class Validator {
  public validate(schema: Schema, data: any): ValidateResult {
    return {
      errors: this.validateByPath(schema, data, ['']).errors,
    };
  }

  public validateByPath(schema: Schema, data: any, path: string[]): ValidateResult {
    const errors: ValidateError[] = [];

    if (this.isArraySchema(schema)) {
      if (Array.isArray(data)) {
        for (const [index, el] of Object.entries(data)) {
          errors.push(...this.validateByPath(schema.members, el, [...path, index]).errors);
        }
      } else {
        errors.push({ message: `${ path.join('.') } should be array` });
      }
    } else if (this.isBooleanSchema(schema)) {
      if (typeof data !== 'boolean') {
        errors.push({ message: `${ path.join('.') } should be boolean` });
      }
    } else if (this.isDateSchema(schema)) {
    } else if (this.isEnumSchema(schema)) {
    } else if (this.isNumberSchema(schema)) {
      if (typeof data !== 'number') {
        errors.push({ message: `${ path.join('.') } should be number` });
      }
    } else if (this.isObjectSchema(schema)) {
    } else if (this.isStringSchema(schema)) {
      if (typeof data !== 'string') {
        errors.push({ message: `${ path.join('.') } should be string` });
      }
    }

    return { errors: errors };
  }

  protected isArraySchema(schema: any): schema is ArraySchema {
    return schema?.type === 'array';
  }

  protected isBooleanSchema(schema: any): schema is BooleanSchema {
    return schema?.type === 'boolean';
  }

  protected isDateSchema(schema: any): schema is DateSchema {
    return schema?.type === 'date';
  }

  protected isEnumSchema(schema: any): schema is EnumSchema {
    return schema?.type === 'enum';
  }

  protected isNumberSchema(schema: any): schema is NumberSchema {
    return schema?.type === 'number';
  }

  protected isObjectSchema(schema: any): schema is ObjectSchema {
    return schema?.type === 'object';
  }

  protected isStringSchema(schema: any): schema is StringSchema {
    return schema?.type === 'string';
  }

  // protected validateByStringSchema(schema: StringSchema, data: any) {
  //
  // }
}

/*
 defultowe wartości:
 - nullable: false
 - required: false
**/

// nullable: jak true to: any[...] | null
// required: jak true to property: any[...]; jak false to: property?: any[...];
export type ArraySchema = {
  members?: Schema;
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'array';
}

// nullable: jak true to: boolean | null
// required: jak true to property: boolean; jak false to: property?: boolean;
export type BooleanSchema = {
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'boolean';
}

// nullable: jak true to: Date | null
// required: jak true to property: Date; jak false to: property?: Date;
export type DateSchema = {
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'date';
}

// nullable: jak true to: enum[...] | null
// required: jak true to property: enum[...]; jak false to: property?: enum[...];
export type EnumSchema = {
  enum: unknown[];
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'enum';
}

// nullable: jak true to: number | null
// required: jak true to property: number; jak false to: property?: number;
export type NumberSchema = {
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'number';
}

// nullable: jak true to: {...} | null
// required: jak true to property: {...}; jak false to: property?: {...};
export type ObjectSchema = {
  members?: { [name: string]: Schema; };
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  strict?: boolean; // jak false to property: {...; [name: any]: any; };
  type: 'object';
}

export type Rule = {
  name: string;
  options?: any;
}

export type Schema =
  | ArraySchema
  | BooleanSchema
  | DateSchema
  | EnumSchema
  | NumberSchema
  | ObjectSchema
  | StringSchema;

// nullable: jak true to: string | null
// required: jak true to property: string; jak false to: property?: string;
export type StringSchema = {
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'string';
}

export interface ValidateError {
  message: string;
}

export interface ValidateResult {
  errors: ValidateError[];
}
