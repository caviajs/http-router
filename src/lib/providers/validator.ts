import { Injectable } from '../decorators/injectable';
import { Schema, SchemaArray, SchemaBoolean, SchemaEnum, SchemaNumber, SchemaObject, SchemaString } from '../types/schema';

const DEFAULT_NULLABLE: boolean = false;
const DEFAULT_REQUIRED: boolean = true;
const DEFAULT_STRICT: boolean = false;

// TODO PATH - znaleźć rozwiązanie
// TODO CUSTOM VALIDATORS (format/pattern/rules) - znaleźć rozwiązanie + async
// TODO VALIDATION
// TODO PARSING/CASTING

@Injectable()
export class Validator {
  public validate(schema: Schema, data: any): ValidateError[] {
    return this.executeValidation(schema, data, []);
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

  protected validateSchemaArray(schema: SchemaArray, data: any, path: string[]): ValidateError[] {
    const errors: ValidateError[] = [];

    if (Array.isArray(data)) {
      for (const [index, it] of Object.entries(data)) {
        errors.push(...this.executeValidation(schema.members, it, [...path, index]));
      }
    } else {
      errors.push({ message: 'The value should be array', path: path.join('.') });
    }

    return errors;
  }

  protected validateSchemaBoolean(schema: SchemaBoolean, data: any, path: string[]): ValidateError[] {
    return typeof data !== 'boolean' ? [{ message: 'The value should be boolean', path: path.join('.') }] : [];
  }

  protected validateSchemaEnum(schema: SchemaEnum, data: any, path: string[]): ValidateError[] {
    return schema.enum.includes(data) ? [{ message: `The value must be one of ${ schema.enum.join(', ') }`, path: path.join('.') }] : [];
  }

  protected validateSchemaNumber(schema: SchemaNumber, data: any, path: string[]): ValidateError[] {
    return typeof data !== 'number' ? [{ message: 'The value should be number', path: path.join('.') }] : [];
  }

  protected validateSchemaObject(schema: SchemaObject, data: any, path: string[]): ValidateError[] {
    const errors: ValidateError[] = [];

    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      for (const [memberName, memberSchema] of Object.entries(schema.members || {})) {
        errors.push(...this.executeValidation(memberSchema, data[memberName], [...path, memberName]));
      }
    } else {
      errors.push({ message: 'The value should be object', path: path.join('.') });
    }

    return errors;
  }

  protected validateSchemaString(schema: SchemaString, data: any, path: string[]): ValidateError[] {
    return typeof data !== 'string' ? [{ message: 'The value should be string', path: path.join('.') }] : [];
  }

  protected executeValidation(schema: Schema, data: any, path: string[]): ValidateError[] {
    const errors: ValidateError[] = [];

    if (schema.required === true && data === undefined) {
      errors.push({ message: 'The value is required', path: path.join('.') });
    }

    if (schema.nullable === true && data === null) {
      return [];
    }

    if (this.isSchemaArray(schema)) {
      errors.push(...this.validateSchemaArray(schema, data, path));
    } else if (this.isSchemaBoolean(schema)) {
      errors.push(...this.validateSchemaBoolean(schema, data, path));
    } else if (this.isSchemaEnum(schema)) {
      errors.push(...this.validateSchemaEnum(schema, data, path));
    } else if (this.isSchemaNumber(schema)) {
      errors.push(...this.validateSchemaNumber(schema, data, path));
    } else if (this.isSchemaObject(schema)) {
      errors.push(...this.validateSchemaObject(schema, data, path));
    } else if (this.isSchemaString(schema)) {
      errors.push(...this.validateSchemaString(schema, data, path));
    }

    return errors;
  }
}

export interface ValidateError {
  message: string;
  path?: string;
}
