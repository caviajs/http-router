import { ValidationError } from './validation-error';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaRequired } from './get-schema-required';

export function isSchemaNumber(schema: any): schema is SchemaNumber {
  return schema?.type === 'number';
}

export function validateSchemaNumber(schema: SchemaNumber, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
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

export type SchemaNumber = {
  description?: string;
  max?: number;
  min?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'number';
}
