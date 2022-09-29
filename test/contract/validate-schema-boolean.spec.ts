import { Readable } from 'stream';
import { SchemaBoolean, validateSchemaBoolean } from '../../src';

const path: string[] = ['foo', 'bar'];

describe('validateSchemaBoolean', () => {
  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(validateSchemaBoolean({ type: 'boolean' }, null)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean({ type: 'boolean' }, null, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(validateSchemaBoolean({ nullable: false, type: 'boolean' }, null)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean({ nullable: false, type: 'boolean' }, null, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(validateSchemaBoolean({ nullable: true, type: 'boolean' }, null)).toEqual([]);
    expect(validateSchemaBoolean({ nullable: true, type: 'boolean' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(validateSchemaBoolean({ type: 'boolean' }, undefined)).toEqual([]);
    expect(validateSchemaBoolean({ type: 'boolean' }, undefined, path)).toEqual([]);

    // required: false
    expect(validateSchemaBoolean({ required: false, type: 'boolean' }, undefined)).toEqual([]);
    expect(validateSchemaBoolean({ required: false, type: 'boolean' }, undefined, path)).toEqual([]);

    // required: true
    expect(validateSchemaBoolean({ required: true, type: 'boolean' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean({ required: true, type: 'boolean' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaBoolean = {
      nullable: false,
      required: true,
      type: 'boolean',
    };

    // string
    expect(validateSchemaBoolean(schema, 'Hello World')).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // number
    expect(validateSchemaBoolean(schema, 1245)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, 1245, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // true
    expect(validateSchemaBoolean(schema, true)).toEqual([]);
    expect(validateSchemaBoolean(schema, true, path)).toEqual([]);

    // false
    expect(validateSchemaBoolean(schema, false)).toEqual([]);
    expect(validateSchemaBoolean(schema, false, path)).toEqual([]);

    // buffer
    expect(validateSchemaBoolean(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // stream
    expect(validateSchemaBoolean(schema, new Readable())).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, new Readable(), path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // undefined
    expect(validateSchemaBoolean(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // symbol
    expect(validateSchemaBoolean(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // null
    expect(validateSchemaBoolean(schema, null)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, null, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // NaN
    expect(validateSchemaBoolean(schema, NaN)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, NaN, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // array
    expect(validateSchemaBoolean(schema, [])).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, [], path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // object
    expect(validateSchemaBoolean(schema, {})).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(validateSchemaBoolean(schema, {}, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);
  });
});
