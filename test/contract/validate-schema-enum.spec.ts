import { Readable } from 'stream';
import { SchemaEnum, validateSchemaEnum } from '../../src';

const path: string[] = ['foo', 'bar'];

describe('validateSchemaEnum', () => {
  it('should validate the enum condition correctly', () => {
    const schema: SchemaEnum = {
      enum: ['Hello', 'World'],
      nullable: false,
      required: true,
      type: 'enum',
    };

    // valid
    expect(validateSchemaEnum(schema, 'Hello')).toEqual([]);
    expect(validateSchemaEnum(schema, 'Hello', path)).toEqual([]);

    expect(validateSchemaEnum(schema, 'World')).toEqual([]);
    expect(validateSchemaEnum(schema, 'World', path)).toEqual([]);

    // invalid
    expect(validateSchemaEnum(schema, 'Foo')).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, 'Foo', path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], type: 'enum' }, null)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], type: 'enum' }, null, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], nullable: false, type: 'enum' }, null)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], nullable: false, type: 'enum' }, null, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], nullable: true, type: 'enum' }, null)).toEqual([]);
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], nullable: true, type: 'enum' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], type: 'enum' }, undefined)).toEqual([]);
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], type: 'enum' }, undefined, path)).toEqual([]);

    // required: false
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], required: false, type: 'enum' }, undefined)).toEqual([]);
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], required: false, type: 'enum' }, undefined, path)).toEqual([]);

    // required: true
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], required: true, type: 'enum' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum({ enum: ['Hello', 'World'], required: true, type: 'enum' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaEnum = {
      enum: ['Hello', 'World'],
      nullable: false,
      required: true,
      type: 'enum',
    };

    // string
    expect(validateSchemaEnum(schema, 'Hello World')).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, 'Hello World', path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // number
    expect(validateSchemaEnum(schema, 1245)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, 1245, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // true
    expect(validateSchemaEnum(schema, true)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, true, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // false
    expect(validateSchemaEnum(schema, false)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, false, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // buffer
    expect(validateSchemaEnum(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // stream
    expect(validateSchemaEnum(schema, new Readable())).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, new Readable(), path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // undefined
    expect(validateSchemaEnum(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // symbol
    expect(validateSchemaEnum(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // null
    expect(validateSchemaEnum(schema, null)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, null, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // NaN
    expect(validateSchemaEnum(schema, NaN)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, NaN, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // array
    expect(validateSchemaEnum(schema, [])).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, [], path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // object
    expect(validateSchemaEnum(schema, {})).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(validateSchemaEnum(schema, {}, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);
  });
});
