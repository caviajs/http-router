import { Readable } from 'stream';
import { SchemaObject, validateSchemaObject } from '../../src';

const path: string[] = ['foo', 'bar'];

describe('validateSchemaObject', () => {
  it('should validate the strict condition correctly', () => {
    // strict: false (default)
    {
      const schema: SchemaObject = {
        type: 'object',
      };

      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
    }

    {
      const schema: SchemaObject = {
        properties: {
          foo: { type: 'string' },
        },
        type: 'object',
      };

      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
    }

    // strict: false
    {
      const schema: SchemaObject = {
        type: 'object',
        strict: false,
      };

      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);

      expect(validateSchemaObject(schema, {})).toEqual([]);
      expect(validateSchemaObject(schema, {}, path)).toEqual([]);
    }

    {
      const schema: SchemaObject = {
        properties: {
          foo: { type: 'string' },
        },
        strict: false,
        type: 'object',
      };

      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
    }

    // strict: true
    {
      const schema: SchemaObject = {
        type: 'object',
        strict: true,
      };

      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' })).toEqual([
        { message: 'The following property is not allowed: foo', path: '' },
        { message: 'The following property is not allowed: bar', path: '' },
      ]);
      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([
        { message: 'The following property is not allowed: foo', path: 'foo.bar' },
        { message: 'The following property is not allowed: bar', path: 'foo.bar' },
      ]);
    }

    {
      const schema: SchemaObject = {
        properties: {
          foo: { type: 'string' },
          bar: { type: 'string' },
        },
        strict: true,
        type: 'object',
      };

      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello', baz: 'hello', bax: 'hello' })).toEqual([
        { message: 'The following property is not allowed: baz', path: '' },
        { message: 'The following property is not allowed: bax', path: '' },
      ]);
      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello', baz: 'hello', bax: 'hello' }, path)).toEqual([
        { message: 'The following property is not allowed: baz', path: 'foo.bar' },
        { message: 'The following property is not allowed: bax', path: 'foo.bar' },
      ]);

      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello', baz: 'hello' })).toEqual([
        { message: 'The following property is not allowed: baz', path: '' },
      ]);
      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello', baz: 'hello' }, path)).toEqual([
        { message: 'The following property is not allowed: baz', path: 'foo.bar' },
      ]);

      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(validateSchemaObject(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
    }
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(validateSchemaObject({ type: 'object' }, null)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject({ type: 'object' }, null, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(validateSchemaObject({ nullable: false, type: 'object' }, null)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject({ nullable: false, type: 'object' }, null, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(validateSchemaObject({ nullable: true, type: 'object' }, null)).toEqual([]);
    expect(validateSchemaObject({ nullable: true, type: 'object' }, null, path)).toEqual([]);
  });

  it('should validate the properties condition correctly', () => {
    const schema: SchemaObject = {
      nullable: false,
      properties: {
        name: {
          required: true,
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
      required: true,
      type: 'object',
    };

    expect(validateSchemaObject(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be object', path: '' },
      { message: 'The value is required', path: 'name' },
      { message: 'The value should be string', path: 'name' },
    ]);
    expect(validateSchemaObject(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be object', path: 'foo.bar' },
      { message: 'The value is required', path: 'foo.bar.name' },
      { message: 'The value should be string', path: 'foo.bar.name' },
    ]);

    expect(validateSchemaObject(schema, {})).toEqual([
      { message: 'The value is required', path: 'name' },
      { message: 'The value should be string', path: 'name' },
    ]);
    expect(validateSchemaObject(schema, {}, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar.name' },
      { message: 'The value should be string', path: 'foo.bar.name' },
    ]);

    expect(validateSchemaObject(schema, { age: '1245' })).toEqual([
      { message: 'The value is required', path: 'name' },
      { message: 'The value should be string', path: 'name' },
      { message: 'The value should be number', path: 'age' },
    ]);
    expect(validateSchemaObject(schema, { age: '1245' }, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar.name' },
      { message: 'The value should be string', path: 'foo.bar.name' },
      { message: 'The value should be number', path: 'foo.bar.age' },
    ]);

    expect(validateSchemaObject(schema, { name: 'Hello', age: '1245' })).toEqual([
      { message: 'The value should be number', path: 'age' },
    ]);
    expect(validateSchemaObject(schema, { name: 'Hello', age: '1245' }, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar.age' },
    ]);

    expect(validateSchemaObject(schema, { name: 'Hello', age: 1245 })).toEqual([]);
    expect(validateSchemaObject(schema, { name: 'Hello', age: 1245 }, path)).toEqual([]);

    expect(validateSchemaObject(schema, { name: 'Hello' })).toEqual([]);
    expect(validateSchemaObject(schema, { name: 'Hello' }, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(validateSchemaObject({ type: 'object' }, undefined)).toEqual([]);
    expect(validateSchemaObject({ type: 'object' }, undefined, path)).toEqual([]);

    // required: false
    expect(validateSchemaObject({ required: false, type: 'object' }, undefined)).toEqual([]);
    expect(validateSchemaObject({ required: false, type: 'object' }, undefined, path)).toEqual([]);

    // required: true
    expect(validateSchemaObject({ required: true, type: 'object' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject({ required: true, type: 'object' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be object', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaObject = {
      nullable: false,
      required: true,
      type: 'object',
    };

    // string
    expect(validateSchemaObject(schema, 'Hello World')).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // number
    expect(validateSchemaObject(schema, 1245)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, 1245, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // true
    expect(validateSchemaObject(schema, true)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, true, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // false
    expect(validateSchemaObject(schema, false)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, false, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // buffer
    expect(validateSchemaObject(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // stream
    expect(validateSchemaObject(schema, new Readable())).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, new Readable(), path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // undefined
    expect(validateSchemaObject(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // symbol
    expect(validateSchemaObject(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // null
    expect(validateSchemaObject(schema, null)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, null, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // NaN
    expect(validateSchemaObject(schema, NaN)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, NaN, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // array
    expect(validateSchemaObject(schema, [])).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(validateSchemaObject(schema, [], path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // object
    expect(validateSchemaObject(schema, {})).toEqual([]);
    expect(validateSchemaObject(schema, {}, path)).toEqual([]);
  });
});
