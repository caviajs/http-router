import { getSchemaRequired } from './get-schema-required';
import { getSchemaStrict } from './get-schema-strict';
import { getSchemaNullable } from './get-schema-nullable';
import { isSchemaArray, SchemaArray } from './schema-array';
import { isSchemaBoolean, SchemaBoolean } from './schema-boolean';
import { isSchemaBuffer, SchemaBuffer } from './schema-buffer';
import { isSchemaEnum, SchemaEnum } from './schema-enum';
import { isSchemaNumber, SchemaNumber } from './schema-number';
import { isSchemaObject, SchemaObject } from './schema-object';
import { isSchemaStream, SchemaStream } from './schema-stream';
import { isSchemaString, SchemaString } from './schema-string';

export function generateStructure(schema: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaStream | SchemaString): string {
  let content: string = '';

  if (isSchemaArray(schema)) {
    if (isSchemaEnum(schema.items)) {
      content += `(${ generateStructure(schema.items) })[]`;
    } else {
      content += `${ generateStructure(schema.items) }[]`;
    }
  } else if (isSchemaBoolean(schema)) {
    content += 'boolean';
  } else if (isSchemaBuffer(schema)) {
    content += 'Buffer';
  } else if (isSchemaEnum(schema)) {
    Object.values(schema.enum).forEach((value, index) => {
      if (index !== 0) {
        content += '|';
      }

      content += `'${ value }'`;
    });
  } else if (isSchemaNumber(schema)) {
    content += 'number';
  } else if (isSchemaObject(schema)) {
    content += '{';

    Object.entries(schema.properties || {}).forEach(([propertyKey, propertySchema]) => {
      content += `'${ propertyKey }'${ getSchemaRequired(propertySchema) ? '' : '?' }: ${ generateStructure(propertySchema) };`;
    });

    if (getSchemaStrict(schema) === false) {
      content += `[name: string]: any;`;
    }

    content += '}';
  } else if (isSchemaStream(schema)) {
    content += 'Readable';
  } else if (isSchemaString(schema)) {
    content += 'string';
  } else {
    content += 'unknown';
  }

  if (getSchemaNullable(schema) === true) {
    content += '|null';
  }

  return content;
}
