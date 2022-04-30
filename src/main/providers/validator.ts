import { Injectable } from '../decorators/injectable';
import { Schema, SchemaArray, SchemaBoolean, SchemaEnum, SchemaNumber, SchemaObject, SchemaString } from '../types/schema';

const DEFAULT_ADDITIONAL_PROPERTIES: boolean = true;
const DEFAULT_NULLABLE: boolean = false;
const DEFAULT_REQUIRED: boolean = false;

@Injectable()
export class Validator {
  public validate(schema: Schema, data: any, path: string[] = []): ValidationError[] {
    const errors: ValidationError[] = [];

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

  protected isNullable(schema: Schema): boolean {
    return schema.hasOwnProperty('nullable') ? schema.nullable : DEFAULT_NULLABLE;
  }

  protected isRequired(schema: Schema): boolean {
    return schema.hasOwnProperty('required') ? schema.required : DEFAULT_REQUIRED;
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

  protected validateSchemaArray(schema: SchemaArray, data: any, path: string[]): ValidationError[] {
    if ((this.isNullable(schema) === true && data === null) || (this.isRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (this.isRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (Array.isArray(data)) {
      for (const [index, it] of Object.entries(data)) {
        errors.push(...this.validate(schema.schema, it, [...path, index]));
      }
    } else {
      errors.push({ message: `The value should be array`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('maxItems') && (!Array.isArray(data) || data.length > schema.maxItems)) {
      errors.push({ message: `The value can contain maximum ${ schema.maxItems } items`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('minItems') && (!Array.isArray(data) || data.length < schema.minItems)) {
      errors.push({ message: `The value should contain minimum ${ schema.maxItems } items`, path: path.join('.') });
    }

    return errors;
  }

  protected validateSchemaBoolean(schema: SchemaBoolean, data: any, path: string[]): ValidationError[] {
    if ((this.isNullable(schema) === true && data === null) || (this.isRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (this.isRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'boolean') {
      errors.push({ message: `The value should be boolean`, path: path.join('.') });
    }

    return errors;
  }

  protected validateSchemaEnum(schema: SchemaEnum, data: any, path: string[]): ValidationError[] {
    if ((this.isNullable(schema) === true && data === null) || (this.isRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (this.isRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (!schema.enum.includes(data)) {
      errors.push({ message: `The value must be one of ${ schema.enum.join(', ') }`, path: path.join('.') });
    }

    return errors;
  }

  protected validateSchemaNumber(schema: SchemaNumber, data: any, path: string[]): ValidationError[] {
    if ((this.isNullable(schema) === true && data === null) || (this.isRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (this.isRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'number' || isNaN(data)) {
      errors.push({ message: `The value should be number`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('max') && (typeof data !== 'number' || data > schema.max)) {
      errors.push({ message: `The value should be less than or equal to ${ schema.max }`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('min') && (typeof data !== 'number' || data < schema.min)) {
      errors.push({ message: `The value should be greater than or equal to ${ schema.min }`, path: path.join('.') });
    }

    return errors;
  }

  protected validateSchemaObject(schema: SchemaObject, data: any, path: string[]): ValidationError[] {
    if ((this.isNullable(schema) === true && data === null) || (this.isRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (this.isRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      for (const [propertyName, propertySchema] of Object.entries(schema.properties || {})) {
        errors.push(...this.validate(propertySchema, data[propertyName], [...path, propertyName]));
      }
    } else {
      errors.push({ message: `The value should be object`, path: path.join('.') });
    }

    return errors;
  }

  protected validateSchemaString(schema: SchemaString, data: any, path: string[]): ValidationError[] {
    if ((this.isNullable(schema) === true && data === null) || (this.isRequired(schema) === false && data === undefined)) {
      return [];
    }

    const errors: ValidationError[] = [];

    if (this.isRequired(schema) === true && data === undefined) {
      errors.push({ message: `The value is required`, path: path.join('.') });
    }

    if (typeof data !== 'string') {
      errors.push({ message: `The value should be string`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('expressions')) {
      for (const expression of schema.expressions) {
        if (typeof data !== 'string' || expression.test(data)) {
          errors.push({ message: `The value should match a regular expression ${ expression }`, path: path.join('.') });
        }
      }
    }

    if (schema.hasOwnProperty('maxLength') && (typeof data !== 'string' || data.length > schema.maxLength)) {
      errors.push({ message: `The value must be shorter than or equal to ${ schema.maxLength } characters`, path: path.join('.') });
    }

    if (schema.hasOwnProperty('minLength') && (typeof data !== 'string' || data.length < schema.minLength)) {
      errors.push({ message: `The value must be longer than or equal to ${ schema.minLength } characters`, path: path.join('.') });
    }

    return errors;
  }
}

export interface ValidationError {
  message: string;
  path: string;
}
