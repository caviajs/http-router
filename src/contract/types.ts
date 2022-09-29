import { SchemaArray } from './schema-array';
import { SchemaBoolean } from './schema-boolean';
import { SchemaBuffer } from './schema-buffer';
import { SchemaEnum } from './schema-enum';
import { SchemaNumber } from './schema-number';
import { SchemaObject } from './schema-object';
import { SchemaStream } from './schema-stream';
import { SchemaString } from './schema-string';

export interface RequestBodySchema {
  'application/json'?: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaNumber | SchemaObject | SchemaStream;
  'application/octet-stream'?: SchemaBuffer | SchemaStream;
  'application/pdf'?: SchemaBuffer | SchemaStream;
  'application/x-www-form-urlencoded'?: SchemaBuffer | SchemaStream | SchemaObject;
  'application/xml'?: SchemaBuffer | SchemaStream | SchemaString;
  'image/gif'?: SchemaBuffer | SchemaStream;
  'image/jpeg'?: SchemaBuffer | SchemaStream;
  'image/png'?: SchemaBuffer | SchemaStream;
  'image/tiff'?: SchemaBuffer | SchemaStream;
  'multipart/form-data'?: SchemaBuffer | SchemaStream;
  'text/css'?: SchemaBuffer | SchemaStream | SchemaString;
  'text/csv'?: SchemaBuffer | SchemaStream | SchemaString;
  'text/html'?: SchemaBuffer | SchemaStream | SchemaString;
  'text/plain'?: SchemaBuffer | SchemaStream | SchemaString;
  'video/mp4'?: SchemaBuffer | SchemaStream;
}

export interface RequestHeadersSchema {
  [name: string]: SchemaEnum | SchemaString;
}

export interface RequestParamsSchema {
  [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
}

export interface RequestQuerySchema {
  [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
}

export type ResponseBodySchema =
  | SchemaArray
  | SchemaBoolean
  | SchemaBuffer
  | SchemaEnum
  | SchemaNumber
  | SchemaObject
  | SchemaStream
  | SchemaString;

export interface ResponseHeadersSchema {
  [name: string]: SchemaEnum | SchemaString;
}
