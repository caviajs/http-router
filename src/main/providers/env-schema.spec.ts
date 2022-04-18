import { ENV_SCHEMA, EnvSchemaProvider } from './env-schema';

describe('EnvSchemaProvider', () => {
  it('should have the appropriate token', () => {
    expect(EnvSchemaProvider.provide).toEqual(ENV_SCHEMA);
  });

  it('should have the correct value by default', () => {
    expect(EnvSchemaProvider.useValue).toEqual({});
  });
});
