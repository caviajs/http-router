import { SchemaStream, validateSchemaStream } from '../../src';
import { Readable } from 'stream';

const path: string[] = ['foo', 'bar'];

describe('validateSchemaStream', () => {
  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(validateSchemaStream({ type: 'stream' }, null)).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream({ type: 'stream' }, null, path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(validateSchemaStream({ nullable: false, type: 'stream' }, null)).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream({ nullable: false, type: 'stream' }, null, path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(validateSchemaStream({ nullable: true, type: 'stream' }, null)).toEqual([]);
    expect(validateSchemaStream({ nullable: true, type: 'stream' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(validateSchemaStream({ type: 'stream' }, undefined)).toEqual([]);
    expect(validateSchemaStream({ type: 'stream' }, undefined, path)).toEqual([]);

    // required: false
    expect(validateSchemaStream({ required: false, type: 'stream' }, undefined)).toEqual([]);
    expect(validateSchemaStream({ required: false, type: 'stream' }, undefined, path)).toEqual([]);

    // required: true
    expect(validateSchemaStream({ required: true, type: 'stream' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream({ required: true, type: 'stream' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaStream = {
      nullable: false,
      required: true,
      type: 'stream',
    };

    // string
    expect(validateSchemaStream(schema, 'Hello World')).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // number
    expect(validateSchemaStream(schema, 1245)).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, 1245, path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // true
    expect(validateSchemaStream(schema, true)).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, true, path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // false
    expect(validateSchemaStream(schema, false)).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, false, path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // buffer
    expect(validateSchemaStream(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // stream
    expect(validateSchemaStream(schema, new Readable())).toEqual([]);
    expect(validateSchemaStream(schema, new Readable(), path)).toEqual([]);

    // undefined
    expect(validateSchemaStream(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // symbol
    expect(validateSchemaStream(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // null
    expect(validateSchemaStream(schema, null)).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, null, path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // NaN
    expect(validateSchemaStream(schema, NaN)).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, NaN, path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // array
    expect(validateSchemaStream(schema, [])).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, [], path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);

    // object
    expect(validateSchemaStream(schema, {})).toEqual([
      { message: 'The value should be stream', path: '' },
    ]);
    expect(validateSchemaStream(schema, {}, path)).toEqual([
      { message: 'The value should be stream', path: 'foo.bar' },
    ]);
  });
});
