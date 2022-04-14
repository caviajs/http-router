export type Schema =
  | SchemaArray
  | SchemaBoolean
  | SchemaEnum
  | SchemaNumber
  | SchemaObject
  | SchemaString;

export type SchemaArray = {
  members?: Schema;
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
  nullable?: boolean;
  required?: boolean;
  type: 'number';
}

export type SchemaObject = {
  members?: { [name: string]: Schema; };
  nullable?: boolean;
  required?: boolean;
  strict?: boolean;
  type: 'object';
}

export type SchemaString = {
  nullable?: boolean;
  required?: boolean;
  type: 'string';
}
