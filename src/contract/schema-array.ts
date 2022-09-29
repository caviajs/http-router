import { isSchemaBoolean, SchemaBoolean, validateSchemaBoolean } from './schema-boolean';
import { isSchemaEnum, SchemaEnum, validateSchemaEnum } from './schema-enum';
import { isSchemaNumber, SchemaNumber, validateSchemaNumber } from './schema-number';
import { isSchemaObject, SchemaObject, validateSchemaObject } from './schema-object';
import { isSchemaString, SchemaString, validateSchemaString } from './schema-string';
import { ValidationError } from './validation-error';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaRequired } from './get-schema-required';

export function isSchemaArray(schema: any): schema is SchemaArray {
  return schema?.type === 'array';
}

export function validateSchemaArray(schema: SchemaArray, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if (Array.isArray(data)) {
    if (schema.items) {
      if (isSchemaArray(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaArray(schema.items, it, [...path, index]));
        }
      } else if (isSchemaBoolean(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaBoolean(schema.items, it, [...path, index]));
        }
      } else if (isSchemaEnum(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaEnum(schema.items, it, [...path, index]));
        }
      } else if (isSchemaNumber(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaNumber(schema.items, it, [...path, index]));
        }
      } else if (isSchemaObject(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaObject(schema.items, it, [...path, index]));
        }
      } else if (isSchemaString(schema.items)) {
        for (const [index, it] of Object.entries(data)) {
          errors.push(...validateSchemaString(schema.items, it, [...path, index]));
        }
      }
    }
  } else {
    errors.push({ message: `The value should be array`, path: path.join('.') });
  }

  if (schema.hasOwnProperty('maxItems') && (!Array.isArray(data) || data.length > schema.maxItems)) {
    errors.push({ message: `The value can contain maximum ${ schema.maxItems } items`, path: path.join('.') });
  }

  if (schema.hasOwnProperty('minItems') && (!Array.isArray(data) || data.length < schema.minItems)) {
    errors.push({ message: `The value should contain minimum ${ schema.minItems } items`, path: path.join('.') });
  }

  return errors;
}

export type SchemaArray = {
  description?: string;
  items?:
    | SchemaArray
    | SchemaBoolean
    | SchemaEnum
    | SchemaNumber
    | SchemaObject
    | SchemaString;
  maxItems?: number;
  minItems?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'array';
}
