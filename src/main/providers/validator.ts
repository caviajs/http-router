import { Injectable } from '../decorators/injectable';
import { Schema, SchemaArray, SchemaBoolean, SchemaEnum, SchemaNumber, SchemaObject, SchemaString } from '../types/schema';

const DEFAULT_NULLABLE: boolean = false;
const DEFAULT_REQUIRED: boolean = true;
const DEFAULT_STRICT: boolean = false;

const MESSAGES = {
  'required': 'The value is required',
};

@Injectable()
export class Validator {
  public async validate(schema: Schema, data: any, path: string[] = []): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if (this.isSchemaArray(schema)) {
      errors.push(...await this.validateSchemaArray(schema, data, path));
    } else if (this.isSchemaBoolean(schema)) {
      errors.push(...await this.validateSchemaBoolean(schema, data, path));
    } else if (this.isSchemaEnum(schema)) {
      errors.push(...await this.validateSchemaEnum(schema, data, path));
    } else if (this.isSchemaNumber(schema)) {
      errors.push(...await this.validateSchemaNumber(schema, data, path));
    } else if (this.isSchemaObject(schema)) {
      errors.push(...await this.validateSchemaObject(schema, data, path));
    } else if (this.isSchemaString(schema)) {
      errors.push(...await this.validateSchemaString(schema, data, path));
    }

    return errors;
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

  protected async validateSchemaArray(schema: SchemaArray, data: any, path: string[]): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if (schema.nullable === true && data === null) {
      return errors;
    }

    if (schema.required === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (Array.isArray(data)) {
      for (const [index, it] of Object.entries(data)) {
        errors.push(...await this.validate(schema.members, it, [...path, index]));
      }
    } else {
      errors.push({ message: `The value should be array`, path: path.join('.') });
    }

    return errors;
  }

  protected async validateSchemaBoolean(schema: SchemaBoolean, data: any, path: string[]): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if (schema.nullable === true && data === null) {
      return errors;
    }

    if (schema.required === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'boolean') {
      errors.push({ message: `The value should be boolean`, path: path.join('.') });
    }

    return errors;
  }

  protected async validateSchemaEnum(schema: SchemaEnum, data: any, path: string[]): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if (schema.nullable === true && data === null) {
      return errors;
    }

    if (schema.required === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (!schema.enum.includes(data)) {
      errors.push({ message: `The value must be one of ${ schema.enum.join(', ') }`, path: path.join('.') });
    }

    return errors;
  }

  protected async validateSchemaNumber(schema: SchemaNumber, data: any, path: string[]): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if (schema.nullable === true && data === null) {
      return errors;
    }

    if (schema.required === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'number' || isNaN(data)) {
      errors.push({ message: `The value should be number`, path: path.join('.') });
    }

    return errors;
  }

  protected async validateSchemaObject(schema: SchemaObject, data: any, path: string[]): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if (schema.nullable === true && data === null) {
      return errors;
    }

    if (schema.required === true && data === undefined) {
      errors.push({ message: `The value is required at`, path: path.join('.') });
    }

    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      for (const [memberName, memberSchema] of Object.entries(schema.members || {})) {
        errors.push(...await this.validate(memberSchema, data[memberName], [...path, memberName]));
      }
    } else {
      errors.push({ message: `The value should be object`, path: path.join('.') });
    }

    return errors;
  }

  protected async validateSchemaString(schema: SchemaString, data: any, path: string[]): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    if (schema.nullable === true && data === null) {
      return errors;
    }

    if (schema.required === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'string') {
      errors.push({ message: `The value should be string`, path: path.join('.') });
    }

    return errors;
  }
}

export interface ValidationError {
  message: string;
  path: string;
}
