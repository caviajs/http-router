import { ValidationError } from './validation-error';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaRequired } from './get-schema-required';

export function isSchemaBoolean(schema: any): schema is SchemaBoolean {
  return schema?.type === 'boolean';
}

export function validateSchemaBoolean(schema: SchemaBoolean, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if (typeof data !== 'boolean') {
    errors.push({ message: `The value should be boolean`, path: path.join('.') });
  }

  return errors;
}

export type SchemaBoolean = {
  description?: string;
  nullable?: boolean;
  required?: boolean;
  type: 'boolean';
}
