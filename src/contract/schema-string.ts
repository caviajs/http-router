import { ValidationError } from './validation-error';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaRequired } from './get-schema-required';

export function isSchemaString(schema: any): schema is SchemaString {
  return schema?.type === 'string';
}

export function validateSchemaString(schema: SchemaString, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if (typeof data !== 'string') {
    errors.push({ message: `The value should be string`, path: path.join('.') });
  }

  if (schema.hasOwnProperty('expressions')) {
    for (const expression of schema.expressions) {
      if (typeof data !== 'string' || expression.test(data) === false) {
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

export type SchemaString = {
  description?: string;
  expressions?: RegExp[];
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'string';
}
