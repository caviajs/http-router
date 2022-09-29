import { ValidationError } from './validation-error';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaRequired } from './get-schema-required';

export function isSchemaBuffer(schema: any): schema is SchemaBuffer {
  return schema?.type === 'buffer';
}

export function validateSchemaBuffer(schema: SchemaBuffer, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if (Buffer.isBuffer(data) === false) {
    errors.push({ message: `The value should be buffer`, path: path.join('.') });
  }

  if (schema.hasOwnProperty('maxLength') && (Buffer.isBuffer(data) === false || data?.length > schema.maxLength)) {
    errors.push({ message: `The value size should be less than or equal to ${ schema.maxLength }`, path: path.join('.') });
  }

  if (schema.hasOwnProperty('minLength') && (Buffer.isBuffer(data) === false || data?.length < schema.minLength)) {
    errors.push({ message: `The value size should be greater than or equal to ${ schema.minLength }`, path: path.join('.') });
  }

  return errors;
}

export type SchemaBuffer = {
  description?: string;
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'buffer';
}
