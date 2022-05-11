import { Validator } from './validator';
import { SchemaArray, SchemaBoolean, SchemaEnum, SchemaNumber, SchemaObject, SchemaString } from './schema';

describe('Validator', () => {
  const path: string[] = ['foo', 'bar'];

  describe('SchemaArray', () => {
    it('should validate the items condition correctly', () => {
      const schema: SchemaArray = {
        items: { type: 'string' },
        type: 'array',
      };

      // valid
      expect(Validator.validate(schema, ['Hello', 'World'])).toEqual([]);
      expect(Validator.validate(schema, ['Hello', 'World'], path)).toEqual([]);

      // invalid
      expect(Validator.validate(schema, ['Hello', 12, 'World', 45])).toEqual([
        { message: 'The value should be string', path: '1' },
        { message: 'The value should be string', path: '3' },
      ]);
      expect(Validator.validate(schema, ['Hello', 12, 'World', 45], path)).toEqual([
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
      expect(Validator.validate(schema, ['Hello', 'Hello', 'Hello'])).toEqual([
        { message: 'The value can contain maximum 2 items', path: '' },
      ]);
      expect(Validator.validate(schema, ['Hello', 'Hello', 'Hello'], path)).toEqual([
        { message: 'The value can contain maximum 2 items', path: 'foo.bar' },
      ]);

      // equal to maxLength
      expect(Validator.validate(schema, ['Hello', 'Hello'])).toEqual([]);
      expect(Validator.validate(schema, ['Hello', 'Hello'], path)).toEqual([]);

      // less than maxLength
      expect(Validator.validate(schema, ['Hello'])).toEqual([]);
      expect(Validator.validate(schema, ['Hello'], path)).toEqual([]);
    });

    it('should validate the minItems condition correctly', () => {
      const schema: SchemaArray = {
        minItems: 2,
        type: 'array',
      };

      // greater than minItems
      expect(Validator.validate(schema, ['Hello', 'Hello', 'Hello'])).toEqual([]);
      expect(Validator.validate(schema, ['Hello', 'Hello', 'Hello'], path)).toEqual([]);

      // equal to minItems
      expect(Validator.validate(schema, ['Hello', 'Hello'])).toEqual([]);
      expect(Validator.validate(schema, ['Hello', 'Hello'], path)).toEqual([]);

      // less than minItems
      expect(Validator.validate(schema, ['Hello'])).toEqual([
        { message: 'The value should contain minimum 2 items', path: '' },
      ]);
      expect(Validator.validate(schema, ['Hello'], path)).toEqual([
        { message: 'The value should contain minimum 2 items', path: 'foo.bar' },
      ]);
    });

    it('should validate the nullable condition correctly', () => {
      // nullable: false (default)
      expect(Validator.validate({ type: 'array' }, null)).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate({ type: 'array' }, null, path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // nullable: false
      expect(Validator.validate({ nullable: false, type: 'array' }, null)).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate({ nullable: false, type: 'array' }, null, path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // nullable: true
      expect(Validator.validate({ nullable: true, type: 'array' }, null)).toEqual([]);
      expect(Validator.validate({ nullable: true, type: 'array' }, null, path)).toEqual([]);
    });

    it('should validate the required condition correctly', () => {
      // required: false (default)
      expect(Validator.validate({ type: 'array' }, undefined)).toEqual([]);
      expect(Validator.validate({ type: 'array' }, undefined, path)).toEqual([]);

      // required: false
      expect(Validator.validate({ required: false, type: 'array' }, undefined)).toEqual([]);
      expect(Validator.validate({ required: false, type: 'array' }, undefined, path)).toEqual([]);

      // required: true
      expect(Validator.validate({ required: true, type: 'array' }, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate({ required: true, type: 'array' }, undefined, path)).toEqual([
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
      expect(Validator.validate(schema, 'Hello World')).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, 'Hello World', path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // number
      expect(Validator.validate(schema, 1245)).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, 1245, path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // true
      expect(Validator.validate(schema, true)).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, true, path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // false
      expect(Validator.validate(schema, false)).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, false, path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // undefined
      expect(Validator.validate(schema, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, undefined, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar' },
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // symbol
      expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // null
      expect(Validator.validate(schema, null)).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, null, path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // NaN
      expect(Validator.validate(schema, NaN)).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, NaN, path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);

      // array
      expect(Validator.validate(schema, [])).toEqual([]);
      expect(Validator.validate(schema, [], path)).toEqual([]);

      // object
      expect(Validator.validate(schema, {})).toEqual([
        { message: 'The value should be array', path: '' },
      ]);
      expect(Validator.validate(schema, {}, path)).toEqual([
        { message: 'The value should be array', path: 'foo.bar' },
      ]);
    });
  });

  describe('SchemaBoolean', () => {
    it('should validate the nullable condition correctly', () => {
      // nullable: false (default)
      expect(Validator.validate({ type: 'boolean' }, null)).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate({ type: 'boolean' }, null, path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // nullable: false
      expect(Validator.validate({ nullable: false, type: 'boolean' }, null)).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate({ nullable: false, type: 'boolean' }, null, path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // nullable: true
      expect(Validator.validate({ nullable: true, type: 'boolean' }, null)).toEqual([]);
      expect(Validator.validate({ nullable: true, type: 'boolean' }, null, path)).toEqual([]);
    });

    it('should validate the required condition correctly', () => {
      // required: false (default)
      expect(Validator.validate({ type: 'boolean' }, undefined)).toEqual([]);
      expect(Validator.validate({ type: 'boolean' }, undefined, path)).toEqual([]);

      // required: false
      expect(Validator.validate({ required: false, type: 'boolean' }, undefined)).toEqual([]);
      expect(Validator.validate({ required: false, type: 'boolean' }, undefined, path)).toEqual([]);

      // required: true
      expect(Validator.validate({ required: true, type: 'boolean' }, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate({ required: true, type: 'boolean' }, undefined, path)).toEqual([
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
      expect(Validator.validate(schema, 'Hello World')).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate(schema, 'Hello World', path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // number
      expect(Validator.validate(schema, 1245)).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate(schema, 1245, path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // true
      expect(Validator.validate(schema, true)).toEqual([]);
      expect(Validator.validate(schema, true, path)).toEqual([]);

      // false
      expect(Validator.validate(schema, false)).toEqual([]);
      expect(Validator.validate(schema, false, path)).toEqual([]);

      // undefined
      expect(Validator.validate(schema, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate(schema, undefined, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar' },
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // symbol
      expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // null
      expect(Validator.validate(schema, null)).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate(schema, null, path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // NaN
      expect(Validator.validate(schema, NaN)).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate(schema, NaN, path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // array
      expect(Validator.validate(schema, [])).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate(schema, [], path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);

      // object
      expect(Validator.validate(schema, {})).toEqual([
        { message: 'The value should be boolean', path: '' },
      ]);
      expect(Validator.validate(schema, {}, path)).toEqual([
        { message: 'The value should be boolean', path: 'foo.bar' },
      ]);
    });
  });

  describe('SchemaEnum', () => {
    it('should validate the enum condition correctly', () => {
      const schema: SchemaEnum = {
        enum: ['Hello', 1245, 'World'],
        nullable: false,
        required: true,
        type: 'enum',
      };

      // valid
      expect(Validator.validate(schema, 'Hello')).toEqual([]);
      expect(Validator.validate(schema, 'Hello', path)).toEqual([]);

      expect(Validator.validate(schema, 1245)).toEqual([]);
      expect(Validator.validate(schema, 1245, path)).toEqual([]);

      expect(Validator.validate(schema, 'World')).toEqual([]);
      expect(Validator.validate(schema, 'World', path)).toEqual([]);

      // invalid
      expect(Validator.validate(schema, 'Foo')).toEqual([
        { message: 'The value must be one of the following values: Hello, 1245, World', path: '' },
      ]);
      expect(Validator.validate(schema, 'Foo', path)).toEqual([
        { message: 'The value must be one of the following values: Hello, 1245, World', path: 'foo.bar' },
      ]);
    });

    it('should validate the nullable condition correctly', () => {
      // nullable: false (default)
      expect(Validator.validate({ enum: ['Hello', 'World'], type: 'enum' }, null)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate({ enum: ['Hello', 'World'], type: 'enum' }, null, path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // nullable: false
      expect(Validator.validate({ enum: ['Hello', 'World'], nullable: false, type: 'enum' }, null)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate({ enum: ['Hello', 'World'], nullable: false, type: 'enum' }, null, path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // nullable: true
      expect(Validator.validate({ enum: ['Hello', 'World'], nullable: true, type: 'enum' }, null)).toEqual([]);
      expect(Validator.validate({ enum: ['Hello', 'World'], nullable: true, type: 'enum' }, null, path)).toEqual([]);
    });

    it('should validate the required condition correctly', () => {
      // required: false (default)
      expect(Validator.validate({ enum: ['Hello', 'World'], type: 'enum' }, undefined)).toEqual([]);
      expect(Validator.validate({ enum: ['Hello', 'World'], type: 'enum' }, undefined, path)).toEqual([]);

      // required: false
      expect(Validator.validate({ enum: ['Hello', 'World'], required: false, type: 'enum' }, undefined)).toEqual([]);
      expect(Validator.validate({ enum: ['Hello', 'World'], required: false, type: 'enum' }, undefined, path)).toEqual([]);

      // required: true
      expect(Validator.validate({ enum: ['Hello', 'World'], required: true, type: 'enum' }, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate({ enum: ['Hello', 'World'], required: true, type: 'enum' }, undefined, path)).toEqual([
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
      expect(Validator.validate(schema, 'Hello World')).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, 'Hello World', path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // number
      expect(Validator.validate(schema, 1245)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, 1245, path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // true
      expect(Validator.validate(schema, true)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, true, path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // false
      expect(Validator.validate(schema, false)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, false, path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // undefined
      expect(Validator.validate(schema, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, undefined, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar' },
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // symbol
      expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // null
      expect(Validator.validate(schema, null)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, null, path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // NaN
      expect(Validator.validate(schema, NaN)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, NaN, path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // array
      expect(Validator.validate(schema, [])).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, [], path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);

      // object
      expect(Validator.validate(schema, {})).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: '' },
      ]);
      expect(Validator.validate(schema, {}, path)).toEqual([
        { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
      ]);
    });
  });

  describe('SchemaNumber', () => {
    it('should validate the max condition correctly', () => {
      const schema: SchemaNumber = {
        max: 10,
        type: 'number',
      };

      // greater than max
      expect(Validator.validate(schema, 15)).toEqual([
        { message: 'The value should be less than or equal to 10', path: '' },
      ]);
      expect(Validator.validate(schema, 15, path)).toEqual([
        { message: 'The value should be less than or equal to 10', path: 'foo.bar' },
      ]);

      // equal to max
      expect(Validator.validate(schema, 10)).toEqual([]);
      expect(Validator.validate(schema, 10, path)).toEqual([]);

      // less than max
      expect(Validator.validate(schema, 5)).toEqual([]);
      expect(Validator.validate(schema, 5, path)).toEqual([]);
    });

    it('should validate the min condition correctly', () => {
      const schema: SchemaNumber = {
        min: 10,
        type: 'number',
      };

      // greater than min
      expect(Validator.validate(schema, 15)).toEqual([]);
      expect(Validator.validate(schema, 15, path)).toEqual([]);

      // equal to min
      expect(Validator.validate(schema, 10)).toEqual([]);
      expect(Validator.validate(schema, 10, path)).toEqual([]);

      // less than min
      expect(Validator.validate(schema, 5)).toEqual([
        { message: 'The value should be greater than or equal to 10', path: '' },
      ]);
      expect(Validator.validate(schema, 5, path)).toEqual([
        { message: 'The value should be greater than or equal to 10', path: 'foo.bar' },
      ]);
    });

    it('should validate the nullable condition correctly', () => {
      // nullable: false (default)
      expect(Validator.validate({ type: 'number' }, null)).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate({ type: 'number' }, null, path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // nullable: false
      expect(Validator.validate({ nullable: false, type: 'number' }, null)).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate({ nullable: false, type: 'number' }, null, path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // nullable: true
      expect(Validator.validate({ nullable: true, type: 'number' }, null)).toEqual([]);
      expect(Validator.validate({ nullable: true, type: 'number' }, null, path)).toEqual([]);
    });

    it('should validate the required condition correctly', () => {
      // required: false (default)
      expect(Validator.validate({ type: 'number' }, undefined)).toEqual([]);
      expect(Validator.validate({ type: 'number' }, undefined, path)).toEqual([]);

      // required: false
      expect(Validator.validate({ required: false, type: 'number' }, undefined)).toEqual([]);
      expect(Validator.validate({ required: false, type: 'number' }, undefined, path)).toEqual([]);

      // required: true
      expect(Validator.validate({ required: true, type: 'number' }, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate({ required: true, type: 'number' }, undefined, path)).toEqual([
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
      expect(Validator.validate(schema, 'Hello World')).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, 'Hello World', path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // number
      expect(Validator.validate(schema, 1245)).toEqual([]);
      expect(Validator.validate(schema, 1245, path)).toEqual([]);

      // true
      expect(Validator.validate(schema, true)).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, true, path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // false
      expect(Validator.validate(schema, false)).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, false, path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // undefined
      expect(Validator.validate(schema, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, undefined, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar' },
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // symbol
      expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // null
      expect(Validator.validate(schema, null)).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, null, path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // NaN
      expect(Validator.validate(schema, NaN)).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, NaN, path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // array
      expect(Validator.validate(schema, [])).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, [], path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);

      // object
      expect(Validator.validate(schema, {})).toEqual([
        { message: 'The value should be number', path: '' },
      ]);
      expect(Validator.validate(schema, {}, path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar' },
      ]);
    });
  });

  describe('SchemaObject', () => {
    it('should validate the strict condition correctly', () => {
      // strict: false (default)
      {
        const schema: SchemaObject = {
          type: 'object',
        };

        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
      }

      {
        const schema: SchemaObject = {
          properties: {
            foo: { type: 'string' },
          },
          type: 'object',
        };

        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
      }

      // strict: false
      {
        const schema: SchemaObject = {
          type: 'object',
          strict: false,
        };

        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);

        expect(Validator.validate(schema, {})).toEqual([]);
        expect(Validator.validate(schema, {}, path)).toEqual([]);
      }

      {
        const schema: SchemaObject = {
          properties: {
            foo: { type: 'string' },
          },
          strict: false,
          type: 'object',
        };

        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
      }

      // strict: true
      {
        const schema: SchemaObject = {
          type: 'object',
          strict: true,
        };

        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([
          { message: 'The following property is not allowed: foo', path: '' },
          { message: 'The following property is not allowed: bar', path: '' },
        ]);
        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([
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

        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello', baz: 'hello', bax: 'hello' })).toEqual([
          { message: 'The following property is not allowed: baz', path: '' },
          { message: 'The following property is not allowed: bax', path: '' },
        ]);
        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello', baz: 'hello', bax: 'hello' }, path)).toEqual([
          { message: 'The following property is not allowed: baz', path: 'foo.bar' },
          { message: 'The following property is not allowed: bax', path: 'foo.bar' },
        ]);

        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello', baz: 'hello' })).toEqual([
          { message: 'The following property is not allowed: baz', path: '' },
        ]);
        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello', baz: 'hello' }, path)).toEqual([
          { message: 'The following property is not allowed: baz', path: 'foo.bar' },
        ]);

        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
        expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
      }
    });

    it('should validate the nullable condition correctly', () => {
      // nullable: false (default)
      expect(Validator.validate({ type: 'object' }, null)).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate({ type: 'object' }, null, path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // nullable: false
      expect(Validator.validate({ nullable: false, type: 'object' }, null)).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate({ nullable: false, type: 'object' }, null, path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // nullable: true
      expect(Validator.validate({ nullable: true, type: 'object' }, null)).toEqual([]);
      expect(Validator.validate({ nullable: true, type: 'object' }, null, path)).toEqual([]);
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

      expect(Validator.validate(schema, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be object', path: '' },
        { message: 'The value is required', path: 'name' },
        { message: 'The value should be string', path: 'name' },
      ]);
      expect(Validator.validate(schema, undefined, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar' },
        { message: 'The value should be object', path: 'foo.bar' },
        { message: 'The value is required', path: 'foo.bar.name' },
        { message: 'The value should be string', path: 'foo.bar.name' },
      ]);

      expect(Validator.validate(schema, {})).toEqual([
        { message: 'The value is required', path: 'name' },
        { message: 'The value should be string', path: 'name' },
      ]);
      expect(Validator.validate(schema, {}, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar.name' },
        { message: 'The value should be string', path: 'foo.bar.name' },
      ]);

      expect(Validator.validate(schema, { age: '1245' })).toEqual([
        { message: 'The value is required', path: 'name' },
        { message: 'The value should be string', path: 'name' },
        { message: 'The value should be number', path: 'age' },
      ]);
      expect(Validator.validate(schema, { age: '1245' }, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar.name' },
        { message: 'The value should be string', path: 'foo.bar.name' },
        { message: 'The value should be number', path: 'foo.bar.age' },
      ]);

      expect(Validator.validate(schema, { name: 'Hello', age: '1245' })).toEqual([
        { message: 'The value should be number', path: 'age' },
      ]);
      expect(Validator.validate(schema, { name: 'Hello', age: '1245' }, path)).toEqual([
        { message: 'The value should be number', path: 'foo.bar.age' },
      ]);

      expect(Validator.validate(schema, { name: 'Hello', age: 1245 })).toEqual([]);
      expect(Validator.validate(schema, { name: 'Hello', age: 1245 }, path)).toEqual([]);

      expect(Validator.validate(schema, { name: 'Hello' })).toEqual([]);
      expect(Validator.validate(schema, { name: 'Hello' }, path)).toEqual([]);
    });

    it('should validate the required condition correctly', () => {
      // required: false (default)
      expect(Validator.validate({ type: 'object' }, undefined)).toEqual([]);
      expect(Validator.validate({ type: 'object' }, undefined, path)).toEqual([]);

      // required: false
      expect(Validator.validate({ required: false, type: 'object' }, undefined)).toEqual([]);
      expect(Validator.validate({ required: false, type: 'object' }, undefined, path)).toEqual([]);

      // required: true
      expect(Validator.validate({ required: true, type: 'object' }, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate({ required: true, type: 'object' }, undefined, path)).toEqual([
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
      expect(Validator.validate(schema, 'Hello World')).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, 'Hello World', path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // number
      expect(Validator.validate(schema, 1245)).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, 1245, path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // true
      expect(Validator.validate(schema, true)).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, true, path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // false
      expect(Validator.validate(schema, false)).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, false, path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // undefined
      expect(Validator.validate(schema, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, undefined, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar' },
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // symbol
      expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // null
      expect(Validator.validate(schema, null)).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, null, path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // NaN
      expect(Validator.validate(schema, NaN)).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, NaN, path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // array
      expect(Validator.validate(schema, [])).toEqual([
        { message: 'The value should be object', path: '' },
      ]);
      expect(Validator.validate(schema, [], path)).toEqual([
        { message: 'The value should be object', path: 'foo.bar' },
      ]);

      // object
      expect(Validator.validate(schema, {})).toEqual([]);
      expect(Validator.validate(schema, {}, path)).toEqual([]);
    });
  });

  describe('SchemaString', () => {
    it('should validate the expressions condition correctly', () => {
      const schema: SchemaString = {
        expressions: [
          /^[A-Z]/,
          /[A-Z]$/,
        ],
        type: 'string',
      };

      // valid
      expect(Validator.validate(schema, 'FoO')).toEqual([]);
      expect(Validator.validate(schema, 'FoO', path)).toEqual([]);

      // invalid
      expect(Validator.validate(schema, 'Foo')).toEqual([
        { message: 'The value should match a regular expression /[A-Z]$/', path: '' },
      ]);
      expect(Validator.validate(schema, 'Foo', path)).toEqual([
        { message: 'The value should match a regular expression /[A-Z]$/', path: 'foo.bar' },
      ]);

      expect(Validator.validate(schema, 'foo')).toEqual([
        { message: 'The value should match a regular expression /^[A-Z]/', path: '' },
        { message: 'The value should match a regular expression /[A-Z]$/', path: '' },
      ]);
      expect(Validator.validate(schema, 'foo', path)).toEqual([
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
      expect(Validator.validate(schema, 'HelloHelloHello')).toEqual([
        { message: 'The value must be shorter than or equal to 10 characters', path: '' },
      ]);
      expect(Validator.validate(schema, 'HelloHelloHello', path)).toEqual([
        { message: 'The value must be shorter than or equal to 10 characters', path: 'foo.bar' },
      ]);

      // equal to maxLength
      expect(Validator.validate(schema, 'HelloHello')).toEqual([]);
      expect(Validator.validate(schema, 'HelloHello', path)).toEqual([]);

      // shorter than maxLength
      expect(Validator.validate(schema, 'Hello')).toEqual([]);
      expect(Validator.validate(schema, 'Hello', path)).toEqual([]);
    });

    it('should validate the minLength condition correctly', () => {
      const schema: SchemaString = {
        minLength: 10,
        type: 'string',
      };

      // longer than minLength
      expect(Validator.validate(schema, 'HelloHelloHello')).toEqual([]);
      expect(Validator.validate(schema, 'HelloHelloHello', path)).toEqual([]);

      // equal to minLength
      expect(Validator.validate(schema, 'HelloHello')).toEqual([]);
      expect(Validator.validate(schema, 'HelloHello', path)).toEqual([]);

      // shorter than minLength
      expect(Validator.validate(schema, 'Hello')).toEqual([
        { message: 'The value must be longer than or equal to 10 characters', path: '' },
      ]);
      expect(Validator.validate(schema, 'Hello', path)).toEqual([
        { message: 'The value must be longer than or equal to 10 characters', path: 'foo.bar' },
      ]);
    });

    it('should validate the nullable condition correctly', () => {
      // nullable: false (default)
      expect(Validator.validate({ type: 'string' }, null)).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate({ type: 'string' }, null, path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // nullable: false
      expect(Validator.validate({ nullable: false, type: 'string' }, null)).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate({ nullable: false, type: 'string' }, null, path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // nullable: true
      expect(Validator.validate({ nullable: true, type: 'string' }, null)).toEqual([]);
      expect(Validator.validate({ nullable: true, type: 'string' }, null, path)).toEqual([]);
    });

    it('should validate the required condition correctly', () => {
      // required: false (default)
      expect(Validator.validate({ type: 'string' }, undefined)).toEqual([]);
      expect(Validator.validate({ type: 'string' }, undefined, path)).toEqual([]);

      // required: false
      expect(Validator.validate({ required: false, type: 'string' }, undefined)).toEqual([]);
      expect(Validator.validate({ required: false, type: 'string' }, undefined, path)).toEqual([]);

      // required: true
      expect(Validator.validate({ required: true, type: 'string' }, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate({ required: true, type: 'string' }, undefined, path)).toEqual([
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
      expect(Validator.validate(schema, 'Hello World')).toEqual([]);
      expect(Validator.validate(schema, 'Hello World', path)).toEqual([]);

      // number
      expect(Validator.validate(schema, 1245)).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, 1245, path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // true
      expect(Validator.validate(schema, true)).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, true, path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // false
      expect(Validator.validate(schema, false)).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, false, path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // undefined
      expect(Validator.validate(schema, undefined)).toEqual([
        { message: 'The value is required', path: '' },
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, undefined, path)).toEqual([
        { message: 'The value is required', path: 'foo.bar' },
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // symbol
      expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // null
      expect(Validator.validate(schema, null)).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, null, path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // NaN
      expect(Validator.validate(schema, NaN)).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, NaN, path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // array
      expect(Validator.validate(schema, [])).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, [], path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);

      // object
      expect(Validator.validate(schema, {})).toEqual([
        { message: 'The value should be string', path: '' },
      ]);
      expect(Validator.validate(schema, {}, path)).toEqual([
        { message: 'The value should be string', path: 'foo.bar' },
      ]);
    });
  });
});
