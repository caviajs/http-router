import { Readable } from 'stream';
import { SchemaNumber, validateSchemaNumber } from '../../src';

const path: string[] = ['foo', 'bar'];

describe('validateSchemaNumber', () => {
  it('should validate the max condition correctly', () => {
    const schema: SchemaNumber = {
      max: 10,
      type: 'number',
    };

    // greater than max
    expect(validateSchemaNumber(schema, 15)).toEqual([
      { message: 'The value should be less than or equal to 10', path: '' },
    ]);
    expect(validateSchemaNumber(schema, 15, path)).toEqual([
      { message: 'The value should be less than or equal to 10', path: 'foo.bar' },
    ]);

    // equal to max
    expect(validateSchemaNumber(schema, 10)).toEqual([]);
    expect(validateSchemaNumber(schema, 10, path)).toEqual([]);

    // less than max
    expect(validateSchemaNumber(schema, 5)).toEqual([]);
    expect(validateSchemaNumber(schema, 5, path)).toEqual([]);
  });

  it('should validate the min condition correctly', () => {
    const schema: SchemaNumber = {
      min: 10,
      type: 'number',
    };

    // greater than min
    expect(validateSchemaNumber(schema, 15)).toEqual([]);
    expect(validateSchemaNumber(schema, 15, path)).toEqual([]);

    // equal to min
    expect(validateSchemaNumber(schema, 10)).toEqual([]);
    expect(validateSchemaNumber(schema, 10, path)).toEqual([]);

    // less than min
    expect(validateSchemaNumber(schema, 5)).toEqual([
      { message: 'The value should be greater than or equal to 10', path: '' },
    ]);
    expect(validateSchemaNumber(schema, 5, path)).toEqual([
      { message: 'The value should be greater than or equal to 10', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(validateSchemaNumber({ type: 'number' }, null)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber({ type: 'number' }, null, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(validateSchemaNumber({ nullable: false, type: 'number' }, null)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber({ nullable: false, type: 'number' }, null, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(validateSchemaNumber({ nullable: true, type: 'number' }, null)).toEqual([]);
    expect(validateSchemaNumber({ nullable: true, type: 'number' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(validateSchemaNumber({ type: 'number' }, undefined)).toEqual([]);
    expect(validateSchemaNumber({ type: 'number' }, undefined, path)).toEqual([]);

    // required: false
    expect(validateSchemaNumber({ required: false, type: 'number' }, undefined)).toEqual([]);
    expect(validateSchemaNumber({ required: false, type: 'number' }, undefined, path)).toEqual([]);

    // required: true
    expect(validateSchemaNumber({ required: true, type: 'number' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber({ required: true, type: 'number' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be number', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaNumber = {
      nullable: false,
      required: true,
      type: 'number',
    };

    // string
    expect(validateSchemaNumber(schema, 'Hello World')).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // number
    expect(validateSchemaNumber(schema, 1245)).toEqual([]);
    expect(validateSchemaNumber(schema, 1245, path)).toEqual([]);

    // true
    expect(validateSchemaNumber(schema, true)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, true, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // false
    expect(validateSchemaNumber(schema, false)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, false, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // buffer
    expect(validateSchemaNumber(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // stream
    expect(validateSchemaNumber(schema, new Readable())).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, new Readable(), path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // undefined
    expect(validateSchemaNumber(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // symbol
    expect(validateSchemaNumber(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // null
    expect(validateSchemaNumber(schema, null)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, null, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // NaN
    expect(validateSchemaNumber(schema, NaN)).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, NaN, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // array
    expect(validateSchemaNumber(schema, [])).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, [], path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);

    // object
    expect(validateSchemaNumber(schema, {})).toEqual([
      { message: 'The value should be number', path: '' },
    ]);
    expect(validateSchemaNumber(schema, {}, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar' },
    ]);
  });
});
