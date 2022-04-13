import { Injectable } from '../decorators/injectable';

const DEFAULT_NULLABLE: boolean = false;
const DEFAULT_STRICT: boolean = false;
const DEFAULT_REQUIRED: boolean = false;

@Injectable()
export class Validator {
  public async validate(options: ValidateOptions): Promise<ValidateError[]> {
    return await this.executeValidation(options.schema, options.data, ['']);
  }

  protected isSchemaArray(schema: any): schema is SchemaArray {
    return schema?.type === 'array';
  }

  protected isSchemaBoolean(schema: any): schema is SchemaBoolean {
    return schema?.type === 'boolean';
  }

  protected isSchemaEnum(schema: any): schema is SchemaEnum {
    return schema?.type === 'enum';
  }

  protected isSchemaNumber(schema: any): schema is SchemaNumber {
    return schema?.type === 'number';
  }

  protected isSchemaObject(schema: any): schema is SchemaObject {
    return schema?.type === 'object';
  }

  protected isSchemaString(schema: any): schema is SchemaString {
    return schema?.type === 'string';
  }

  protected async executeValidation(schema: Schema, data: any, path: string[]): Promise<ValidateError[]> {
    const errors: ValidateError[] = [];

    if (this.isSchemaArray(schema)) {
      if (Array.isArray(data)) {
        for (const [index, el] of Object.entries(data)) {
          errors.push(...await this.executeValidation(schema.members, el, [...path, index]));
        }
      } else {
        errors.push({ message: `${ path.join('.') } should be array` });
      }
    } else if (this.isSchemaBoolean(schema)) {
      if (typeof data !== 'boolean') {
        errors.push({ message: `${ path.join('.') } should be boolean` });
      }
    } else if (this.isSchemaEnum(schema)) {
    } else if (this.isSchemaNumber(schema)) {
      if (typeof data !== 'number') {
        errors.push({ message: `${ path.join('.') } should be number` });
      }
    } else if (this.isSchemaObject(schema)) {
    } else if (this.isSchemaString(schema)) {
      if (typeof data !== 'string') {
        errors.push({ message: `${ path.join('.') } should be string` });
      }
    }

    return errors;
  }
}

export type Rule = {
  name: string;
  options?: any;
}

export type Schema =
  | SchemaArray
  | SchemaBoolean
  | SchemaEnum
  | SchemaNumber
  | SchemaObject
  | SchemaString;

/*
 defultowe wartości:
 - nullable: false
 - required: false
**/

// nullable: jak true to: any[...] | null
// required: jak true to property: any[...]; jak false to: property?: any[...];
export type SchemaArray = {
  members?: Schema;
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'array';
}

// nullable: jak true to: boolean | null
// required: jak true to property: boolean; jak false to: property?: boolean;
export type SchemaBoolean = {
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'boolean';
}

// nullable: jak true to: enum[...] | null
// required: jak true to property: enum[...]; jak false to: property?: enum[...];
export type SchemaEnum = {
  enum: unknown[];
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'enum';
}

// nullable: jak true to: number | null
// required: jak true to property: number; jak false to: property?: number;
export type SchemaNumber = {
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'number';
}

// nullable: jak true to: {...} | null
// required: jak true to property: {...}; jak false to: property?: {...};
export type SchemaObject = {
  members?: { [name: string]: Schema; };
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  strict?: boolean; // jak false to property: {...; [name: any]: any; };
  type: 'object';
}

// nullable: jak true to: string | null
// required: jak true to property: string; jak false to: property?: string;
export type SchemaString = {
  nullable?: boolean;
  required?: boolean;
  rules?: Rule[];
  type: 'string';
}

export interface ValidateError {
  message: string;
}

export interface ValidateOptions {
  data: any;
  schema: Schema;
}
