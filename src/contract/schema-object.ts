import { Readable } from 'stream';
import { isSchemaArray, SchemaArray, validateSchemaArray } from './schema-array';
import { isSchemaBoolean, SchemaBoolean, validateSchemaBoolean } from './schema-boolean';
import { isSchemaEnum, SchemaEnum, validateSchemaEnum } from './schema-enum';
import { isSchemaNumber, SchemaNumber, validateSchemaNumber } from './schema-number';
import { isSchemaString, SchemaString, validateSchemaString } from './schema-string';
import { ValidationError } from './validation-error';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaRequired } from './get-schema-required';
import { getSchemaStrict } from './get-schema-strict';

export function isSchemaObject(schema: any): schema is SchemaObject {
  return schema?.type === 'object';
}

export function validateSchemaObject(schema: SchemaObject, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data) && !Buffer.isBuffer(data) && !(data instanceof Readable)) {
    if (getSchemaStrict(schema) === true) {
      for (const propertyName of Object.keys(data)) {
        if ((schema.properties || {}).hasOwnProperty(propertyName) === false) {
          errors.push({ message: `The following property is not allowed: ${ propertyName }`, path: path.join('.') });
        }
      }
    }
  } else {
    errors.push({ message: `The value should be object`, path: path.join('.') });
  }

  for (const [propertyName, propertySchema] of Object.entries(schema.properties || {})) {
    if (isSchemaArray(propertySchema)) {
      errors.push(...validateSchemaArray(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaBoolean(propertySchema)) {
      errors.push(...validateSchemaBoolean(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaEnum(propertySchema)) {
      errors.push(...validateSchemaEnum(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaNumber(propertySchema)) {
      errors.push(...validateSchemaNumber(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaObject(propertySchema)) {
      errors.push(...validateSchemaObject(propertySchema, data?.[propertyName], [...path, propertyName]));
    } else if (isSchemaString(propertySchema)) {
      errors.push(...validateSchemaString(propertySchema, data?.[propertyName], [...path, propertyName]));
    }
  }

  return errors;
}

export type SchemaObject = {
  description?: string;
  nullable?: boolean;
  properties?: {
    [name: string]:
      | SchemaArray
      | SchemaBoolean
      | SchemaEnum
      | SchemaNumber
      | SchemaObject
      | SchemaString;
  };
  required?: boolean;
  strict?: boolean;
  type: 'object';
}
