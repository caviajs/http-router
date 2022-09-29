import { Readable } from 'stream';
import { SchemaString, validateSchemaString } from '../../src';

const path: string[] = ['foo', 'bar'];

describe('validateSchemaString', () => {
  it('should validate the expressions condition correctly', () => {
    const schema: SchemaString = {
      expressions: [
        /^[A-Z]/,
        /[A-Z]$/,
      ],
      type: 'string',
    };

    // valid
    expect(validateSchemaString(schema, 'FoO')).toEqual([]);
    expect(validateSchemaString(schema, 'FoO', path)).toEqual([]);

    // invalid
    expect(validateSchemaString(schema, 'Foo')).toEqual([
      { message: 'The value should match a regular expression /[A-Z]$/', path: '' },
    ]);
    expect(validateSchemaString(schema, 'Foo', path)).toEqual([
      { message: 'The value should match a regular expression /[A-Z]$/', path: 'foo.bar' },
    ]);

    expect(validateSchemaString(schema, 'foo')).toEqual([
      { message: 'The value should match a regular expression /^[A-Z]/', path: '' },
      { message: 'The value should match a regular expression /[A-Z]$/', path: '' },
    ]);
    expect(validateSchemaString(schema, 'foo', path)).toEqual([
      { message: 'The value should match a regular expression /^[A-Z]/', path: 'foo.bar' },
      { message: 'The value should match a regular expression /[A-Z]$/', path: 'foo.bar' },
    ]);
  });

  it('should validate the maxLength condition correctly', () => {
    const schema: SchemaString = {
      maxLength: 10,
      type: 'string',
    };

    // longer than maxLength
    expect(validateSchemaString(schema, 'HelloHelloHello')).toEqual([
      { message: 'The value must be shorter than or equal to 10 characters', path: '' },
    ]);
    expect(validateSchemaString(schema, 'HelloHelloHello', path)).toEqual([
      { message: 'The value must be shorter than or equal to 10 characters', path: 'foo.bar' },
    ]);

    // equal to maxLength
    expect(validateSchemaString(schema, 'HelloHello')).toEqual([]);
    expect(validateSchemaString(schema, 'HelloHello', path)).toEqual([]);

    // shorter than maxLength
    expect(validateSchemaString(schema, 'Hello')).toEqual([]);
    expect(validateSchemaString(schema, 'Hello', path)).toEqual([]);
  });

  it('should validate the minLength condition correctly', () => {
    const schema: SchemaString = {
      minLength: 10,
      type: 'string',
    };

    // longer than minLength
    expect(validateSchemaString(schema, 'HelloHelloHello')).toEqual([]);
    expect(validateSchemaString(schema, 'HelloHelloHello', path)).toEqual([]);

    // equal to minLength
    expect(validateSchemaString(schema, 'HelloHello')).toEqual([]);
    expect(validateSchemaString(schema, 'HelloHello', path)).toEqual([]);

    // shorter than minLength
    expect(validateSchemaString(schema, 'Hello')).toEqual([
      { message: 'The value must be longer than or equal to 10 characters', path: '' },
    ]);
    expect(validateSchemaString(schema, 'Hello', path)).toEqual([
      { message: 'The value must be longer than or equal to 10 characters', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(validateSchemaString({ type: 'string' }, null)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString({ type: 'string' }, null, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(validateSchemaString({ nullable: false, type: 'string' }, null)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString({ nullable: false, type: 'string' }, null, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(validateSchemaString({ nullable: true, type: 'string' }, null)).toEqual([]);
    expect(validateSchemaString({ nullable: true, type: 'string' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(validateSchemaString({ type: 'string' }, undefined)).toEqual([]);
    expect(validateSchemaString({ type: 'string' }, undefined, path)).toEqual([]);

    // required: false
    expect(validateSchemaString({ required: false, type: 'string' }, undefined)).toEqual([]);
    expect(validateSchemaString({ required: false, type: 'string' }, undefined, path)).toEqual([]);

    // required: true
    expect(validateSchemaString({ required: true, type: 'string' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString({ required: true, type: 'string' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be string', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaString = {
      nullable: false,
      required: true,
      type: 'string',
    };

    // string
    expect(validateSchemaString(schema, 'Hello World')).toEqual([]);
    expect(validateSchemaString(schema, 'Hello World', path)).toEqual([]);

    // number
    expect(validateSchemaString(schema, 1245)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, 1245, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // true
    expect(validateSchemaString(schema, true)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, true, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // false
    expect(validateSchemaString(schema, false)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, false, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // buffer
    expect(validateSchemaString(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // stream
    expect(validateSchemaString(schema, new Readable())).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, new Readable(), path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // undefined
    expect(validateSchemaString(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // symbol
    expect(validateSchemaString(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // null
    expect(validateSchemaString(schema, null)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, null, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // NaN
    expect(validateSchemaString(schema, NaN)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, NaN, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // array
    expect(validateSchemaString(schema, [])).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, [], path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // object
    expect(validateSchemaString(schema, {})).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(validateSchemaString(schema, {}, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);
  });
});
