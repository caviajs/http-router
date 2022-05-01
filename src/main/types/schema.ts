export type Schema =
  | SchemaArray
  | SchemaBoolean
  | SchemaEnum
  | SchemaNumber
  | SchemaObject
  | SchemaString;

export type SchemaArray = {
  items?: Schema;
  maxItems?: number;
  minItems?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'array';
}

export type SchemaBoolean = {
  nullable?: boolean;
  required?: boolean;
  type: 'boolean';
}

export type SchemaEnum = {
  enum: unknown[];
  nullable?: boolean;
  required?: boolean;
  type: 'enum';
}

export type SchemaNumber = {
  max?: number;
  min?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'number';
}

export type SchemaObject = {
  additionalProperties?: boolean;
  nullable?: boolean;
  properties?: { [name: string]: Schema; };
  required?: boolean;
  type: 'object';
}

export type SchemaString = {
  expressions?: RegExp[];
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'string';
}
