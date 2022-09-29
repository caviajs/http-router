import { Readable } from 'stream';
import { SchemaBuffer, validateSchemaBuffer } from '../../src';

const path: string[] = ['foo', 'bar'];

describe('validateSchemaBuffer', () => {
  it('should validate the maxLength condition correctly', () => {
    const schema: SchemaBuffer = {
      maxLength: 10,
      type: 'buffer',
    };

    // greater than maxLength
    expect(validateSchemaBuffer(schema, Buffer.from('HelloHelloHello'))).toEqual([
      { message: 'The value size should be less than or equal to 10', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, Buffer.from('HelloHelloHello'), path)).toEqual([
      { message: 'The value size should be less than or equal to 10', path: 'foo.bar' },
    ]);

    // equal to maxLength
    expect(validateSchemaBuffer(schema, Buffer.from('HelloHello'))).toEqual([]);
    expect(validateSchemaBuffer(schema, Buffer.from('HelloHello'), path)).toEqual([]);

    // less than maxLength
    expect(validateSchemaBuffer(schema, Buffer.from('Hello'))).toEqual([]);
    expect(validateSchemaBuffer(schema, Buffer.from('Hello'), path)).toEqual([]);
  });

  it('should validate the minLength condition correctly', () => {
    const schema: SchemaBuffer = {
      minLength: 10,
      type: 'buffer',
    };

    // greater than minLength
    expect(validateSchemaBuffer(schema, Buffer.from('HelloHelloHello'))).toEqual([]);
    expect(validateSchemaBuffer(schema, Buffer.from('HelloHelloHello'), path)).toEqual([]);

    // equal to minLength
    expect(validateSchemaBuffer(schema, Buffer.from('HelloHello'))).toEqual([]);
    expect(validateSchemaBuffer(schema, Buffer.from('HelloHello'), path)).toEqual([]);

    // less than minLength
    expect(validateSchemaBuffer(schema, Buffer.from('Hello'))).toEqual([
      { message: 'The value size should be greater than or equal to 10', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, Buffer.from('Hello'), path)).toEqual([
      { message: 'The value size should be greater than or equal to 10', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(validateSchemaBuffer({ type: 'buffer' }, null)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer({ type: 'buffer' }, null, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(validateSchemaBuffer({ nullable: false, type: 'buffer' }, null)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer({ nullable: false, type: 'buffer' }, null, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(validateSchemaBuffer({ nullable: true, type: 'buffer' }, null)).toEqual([]);
    expect(validateSchemaBuffer({ nullable: true, type: 'buffer' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(validateSchemaBuffer({ type: 'buffer' }, undefined)).toEqual([]);
    expect(validateSchemaBuffer({ type: 'buffer' }, undefined, path)).toEqual([]);

    // required: false
    expect(validateSchemaBuffer({ required: false, type: 'buffer' }, undefined)).toEqual([]);
    expect(validateSchemaBuffer({ required: false, type: 'buffer' }, undefined, path)).toEqual([]);

    // required: true
    expect(validateSchemaBuffer({ required: true, type: 'buffer' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer({ required: true, type: 'buffer' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaBuffer = {
      nullable: false,
      required: true,
      type: 'buffer',
    };

    // string
    expect(validateSchemaBuffer(schema, 'Hello World')).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // number
    expect(validateSchemaBuffer(schema, 1245)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, 1245, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // true
    expect(validateSchemaBuffer(schema, true)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, true, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // false
    expect(validateSchemaBuffer(schema, false)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, false, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // buffer
    expect(validateSchemaBuffer(schema, Buffer.from('Hello World'))).toEqual([]);
    expect(validateSchemaBuffer(schema, Buffer.from('Hello World'), path)).toEqual([]);

    // stream
    expect(validateSchemaBuffer(schema, new Readable())).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, new Readable(), path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // undefined
    expect(validateSchemaBuffer(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // symbol
    expect(validateSchemaBuffer(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // null
    expect(validateSchemaBuffer(schema, null)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, null, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // NaN
    expect(validateSchemaBuffer(schema, NaN)).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, NaN, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // array
    expect(validateSchemaBuffer(schema, [])).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, [], path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);

    // object
    expect(validateSchemaBuffer(schema, {})).toEqual([
      { message: 'The value should be buffer', path: '' },
    ]);
    expect(validateSchemaBuffer(schema, {}, path)).toEqual([
      { message: 'The value should be buffer', path: 'foo.bar' },
    ]);
  });
});
