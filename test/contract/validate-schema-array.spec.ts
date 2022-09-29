import { Readable } from 'stream';
import { SchemaArray, validateSchemaArray } from '../../src';

const path: string[] = ['foo', 'bar'];

describe('validateSchemaArray', () => {
  it('should validate the items condition correctly', () => {
    const schema: SchemaArray = {
      items: { type: 'string' },
      type: 'array',
    };

    // valid
    expect(validateSchemaArray(schema, ['Hello', 'World'])).toEqual([]);
    expect(validateSchemaArray(schema, ['Hello', 'World'], path)).toEqual([]);

    // invalid
    expect(validateSchemaArray(schema, ['Hello', 12, 'World', 45])).toEqual([
      { message: 'The value should be string', path: '1' },
      { message: 'The value should be string', path: '3' },
    ]);
    expect(validateSchemaArray(schema, ['Hello', 12, 'World', 45], path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar.1' },
      { message: 'The value should be string', path: 'foo.bar.3' },
    ]);
  });

  it('should validate the maxItems condition correctly', () => {
    const schema: SchemaArray = {
      maxItems: 2,
      type: 'array',
    };

    // greater than maxLength
    expect(validateSchemaArray(schema, ['Hello', 'Hello', 'Hello'])).toEqual([
      { message: 'The value can contain maximum 2 items', path: '' },
    ]);
    expect(validateSchemaArray(schema, ['Hello', 'Hello', 'Hello'], path)).toEqual([
      { message: 'The value can contain maximum 2 items', path: 'foo.bar' },
    ]);

    // equal to maxLength
    expect(validateSchemaArray(schema, ['Hello', 'Hello'])).toEqual([]);
    expect(validateSchemaArray(schema, ['Hello', 'Hello'], path)).toEqual([]);

    // less than maxLength
    expect(validateSchemaArray(schema, ['Hello'])).toEqual([]);
    expect(validateSchemaArray(schema, ['Hello'], path)).toEqual([]);
  });

  it('should validate the minItems condition correctly', () => {
    const schema: SchemaArray = {
      minItems: 2,
      type: 'array',
    };

    // greater than minItems
    expect(validateSchemaArray(schema, ['Hello', 'Hello', 'Hello'])).toEqual([]);
    expect(validateSchemaArray(schema, ['Hello', 'Hello', 'Hello'], path)).toEqual([]);

    // equal to minItems
    expect(validateSchemaArray(schema, ['Hello', 'Hello'])).toEqual([]);
    expect(validateSchemaArray(schema, ['Hello', 'Hello'], path)).toEqual([]);

    // less than minItems
    expect(validateSchemaArray(schema, ['Hello'])).toEqual([
      { message: 'The value should contain minimum 2 items', path: '' },
    ]);
    expect(validateSchemaArray(schema, ['Hello'], path)).toEqual([
      { message: 'The value should contain minimum 2 items', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(validateSchemaArray({ type: 'array' }, null)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray({ type: 'array' }, null, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(validateSchemaArray({ nullable: false, type: 'array' }, null)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray({ nullable: false, type: 'array' }, null, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(validateSchemaArray({ nullable: true, type: 'array' }, null)).toEqual([]);
    expect(validateSchemaArray({ nullable: true, type: 'array' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(validateSchemaArray({ type: 'array' }, undefined)).toEqual([]);
    expect(validateSchemaArray({ type: 'array' }, undefined, path)).toEqual([]);

    // required: false
    expect(validateSchemaArray({ required: false, type: 'array' }, undefined)).toEqual([]);
    expect(validateSchemaArray({ required: false, type: 'array' }, undefined, path)).toEqual([]);

    // required: true
    expect(validateSchemaArray({ required: true, type: 'array' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray({ required: true, type: 'array' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be array', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaArray = {
      nullable: false,
      required: true,
      type: 'array',
    };

    // string
    expect(validateSchemaArray(schema, 'Hello World')).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // number
    expect(validateSchemaArray(schema, 1245)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, 1245, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // true
    expect(validateSchemaArray(schema, true)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, true, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // false
    expect(validateSchemaArray(schema, false)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, false, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // buffer
    expect(validateSchemaArray(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // stream
    expect(validateSchemaArray(schema, new Readable())).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, new Readable(), path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // undefined
    expect(validateSchemaArray(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // symbol
    expect(validateSchemaArray(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // null
    expect(validateSchemaArray(schema, null)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, null, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // NaN
    expect(validateSchemaArray(schema, NaN)).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, NaN, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);

    // array
    expect(validateSchemaArray(schema, [])).toEqual([]);
    expect(validateSchemaArray(schema, [], path)).toEqual([]);

    // object
    expect(validateSchemaArray(schema, {})).toEqual([
      { message: 'The value should be array', path: '' },
    ]);
    expect(validateSchemaArray(schema, {}, path)).toEqual([
      { message: 'The value should be array', path: 'foo.bar' },
    ]);
  });
});
