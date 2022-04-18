import { ValueProvider } from '../types/provider';
import { Token } from '../types/token';
import { SchemaBoolean, SchemaEnum, SchemaNumber, SchemaString } from '../types/schema';

export const ENV_SCHEMA: Token<EnvSchema> = Symbol('ENV_SCHEMA');

export const EnvSchemaProvider: ValueProvider<EnvSchema> = {
  provide: ENV_SCHEMA,
  useValue: {},
};

export interface EnvSchema {
  [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
}
