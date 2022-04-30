import { ValidationError, Validator } from './validator';

describe('Validator', () => {
  const validator: Validator = new Validator();

  describe('SchemaArray', () => {
    // array
    // 1) nullable
    // 2) required
    // 3) check correct type
  });

  describe('SchemaBoolean', () => {
    // SchemaBoolean
    // 1) nullable
    // 2) required
    // 3) check correct type

    it('should return an error if the data is not a string', () => {
      const path: string[] = ['foo', 'bar'];

      const exampleErrors: ValidationError[] = [{ message: 'The value should be boolean', path: '' }];
      const exampleErrorsWithPath: ValidationError[] = [{ message: 'The value should be boolean', path: 'foo.bar' }];

      // string
      expect(validator.validate({ type: 'boolean' }, 'Hello World')).toEqual(exampleErrors);
      expect(validator.validate({ type: 'boolean' }, 'Hello World', path)).toEqual(exampleErrorsWithPath);

      // number
      expect(validator.validate({ type: 'boolean' }, 1245)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'boolean' }, 1245, path)).toEqual(exampleErrorsWithPath);

      // true
      expect(validator.validate({ type: 'boolean' }, true)).toEqual([]);
      expect(validator.validate({ type: 'boolean' }, true, path)).toEqual([]);

      // false
      expect(validator.validate({ type: 'boolean' }, false)).toEqual([]);
      expect(validator.validate({ type: 'boolean' }, false, path)).toEqual([]);

      // undefined
      expect(validator.validate({ type: 'boolean' }, undefined)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'boolean' }, undefined, path)).toEqual(exampleErrorsWithPath);

      // Symbol
      expect(validator.validate({ type: 'boolean' }, Symbol('Hello World'))).toEqual(exampleErrors);
      expect(validator.validate({ type: 'boolean' }, Symbol('Hello World'), path)).toEqual(exampleErrorsWithPath);

      // null
      expect(validator.validate({ type: 'boolean' }, null)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'boolean' }, null, path)).toEqual(exampleErrorsWithPath);

      // NaN
      expect(validator.validate({ type: 'boolean' }, NaN)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'boolean' }, NaN, path)).toEqual(exampleErrorsWithPath);

      // array
      expect(validator.validate({ type: 'boolean' }, [])).toEqual(exampleErrors);
      expect(validator.validate({ type: 'boolean' }, [], path)).toEqual(exampleErrorsWithPath);

      // object
      expect(validator.validate({ type: 'boolean' }, {})).toEqual(exampleErrors);
      expect(validator.validate({ type: 'boolean' }, {}, path)).toEqual(exampleErrorsWithPath);
    });
  });

  describe('SchemaEnum', () => {
    // SchemaEnum
    // 1) nullable
    // 2) required
    // 3) check correct type
  });

  describe('SchemaNumber', () => {
    // max
    it('should return an error if the number is greater than max value', () => {
      const path: string[] = ['foo', 'bar'];

      expect(validator.validate({ max: 10, type: 'number' }, 15)).toEqual([{ message: 'The value should be less than 10', path: '' }]);
      expect(validator.validate({ max: 10, type: 'number' }, 15, path)).toEqual([{ message: 'The value should be less than 10', path: 'foo.bar' }]);

      expect(validator.validate({ max: 10, type: 'number' }, 5)).toEqual([]);
      expect(validator.validate({ max: 10, type: 'number' }, 5, path)).toEqual([]);
    });

    // min
    it('should return an error if the number is less than min value', () => {
      const path: string[] = ['foo', 'bar'];

      expect(validator.validate({ min: 10, type: 'number' }, 5)).toEqual([{ message: 'The value should be greater than 10', path: '' }]);
      expect(validator.validate({ min: 10, type: 'number' }, 5, path)).toEqual([{ message: 'The value should be greater than 10', path: 'foo.bar' }]);

      expect(validator.validate({ min: 10, type: 'number' }, 15)).toEqual([]);
      expect(validator.validate({ min: 10, type: 'number' }, 15, path)).toEqual([]);
    });

    // nullable
    it('should not return an error if the schema is marked as nullable', () => {
      const path: string[] = ['foo', 'bar'];

      expect(validator.validate({ nullable: true, type: 'number' }, null)).toEqual([]);
      expect(validator.validate({ nullable: true, type: 'number' }, null, path)).toEqual([]);
    });

    // required
    it('should not return an error if the schema is marked as not required and data is undefined', () => {
      const path: string[] = ['foo', 'bar'];

      expect(validator.validate({ required: false, type: 'number' }, undefined)).toEqual([]);
      expect(validator.validate({ required: false, type: 'number' }, undefined, path)).toEqual([]);
    });

    it('should return an error if the schema is marked as required and data is undefined', () => {
      const path: string[] = ['foo', 'bar'];

      expect(validator.validate({ required: true, type: 'number' }, undefined)).toEqual(expect.arrayContaining([
        { message: 'The value is required', path: '' },
      ]));
      expect(validator.validate({ required: true, type: 'number' }, undefined, path)).toEqual(expect.arrayContaining([
        { message: 'The value is required', path: 'foo.bar' },
      ]));
    });

    // check correct type
    it('should return an error if the data is not a number', () => {
      const path: string[] = ['foo', 'bar'];

      const exampleError: ValidationError = { message: 'The value should be number', path: '' };
      const exampleErrorWithPath: ValidationError = { message: 'The value should be number', path: 'foo.bar' };

      // string
      expect(validator.validate({ type: 'number' }, 'Hello World')).toEqual([exampleError]);
      expect(validator.validate({ type: 'number' }, 'Hello World', path)).toEqual([exampleErrorWithPath]);

      // number
      expect(validator.validate({ type: 'number' }, 1245)).toEqual([]);
      expect(validator.validate({ type: 'number' }, 1245, path)).toEqual([]);

      // true
      expect(validator.validate({ type: 'number' }, true)).toEqual([exampleError]);
      expect(validator.validate({ type: 'number' }, true, path)).toEqual([exampleErrorWithPath]);

      // false
      expect(validator.validate({ type: 'number' }, false)).toEqual([exampleError]);
      expect(validator.validate({ type: 'number' }, false, path)).toEqual([exampleErrorWithPath]);

      // undefined
      expect(validator.validate({ required: true, type: 'number' }, undefined)).toEqual(expect.arrayContaining([
        exampleError,
      ]));
      expect(validator.validate({ required: true, type: 'number' }, undefined, path)).toEqual(expect.arrayContaining([
        exampleErrorWithPath,
      ]));

      // Symbol
      expect(validator.validate({ type: 'number' }, Symbol('Hello World'))).toEqual([exampleError]);
      expect(validator.validate({ type: 'number' }, Symbol('Hello World'), path)).toEqual([exampleErrorWithPath]);

      // null
      expect(validator.validate({ type: 'number' }, null)).toEqual([exampleError]);
      expect(validator.validate({ type: 'number' }, null, path)).toEqual([exampleErrorWithPath]);

      // NaN
      expect(validator.validate({ type: 'number' }, NaN)).toEqual([exampleError]);
      expect(validator.validate({ type: 'number' }, NaN, path)).toEqual([exampleErrorWithPath]);

      // array
      expect(validator.validate({ type: 'number' }, [])).toEqual([exampleError]);
      expect(validator.validate({ type: 'number' }, [], path)).toEqual([exampleErrorWithPath]);

      // object
      expect(validator.validate({ type: 'number' }, {})).toEqual([exampleError]);
      expect(validator.validate({ type: 'number' }, {}, path)).toEqual([exampleErrorWithPath]);
    });
  });

  describe('SchemaObject', () => {
    // object
    // 1) nullable
    // 2) required
    // 3) check correct type
  });

  describe('SchemaString', () => {
    // SchemaString
    // 1) nullable
    it('should not return an error if the schema is marked as nullable', () => {
      const path: string[] = ['foo', 'bar'];

      expect(validator.validate({ nullable: true, type: 'string' }, null)).toEqual([]);
      expect(validator.validate({ nullable: true, type: 'string' }, null, path)).toEqual([]);
    });

    // 2) required
    it('should return an error if the schema is marked as required and data is undefined', () => {
      const path: string[] = ['foo', 'bar'];

      expect(validator.validate({ required: true, type: 'string' }, undefined)).toEqual([{ message: 'The value is required', path: '' }]);
      expect(validator.validate({ required: true, type: 'string' }, undefined, path)).toEqual([{ message: 'The value is required', path: 'foo.bar' }]);
    });

    // 3) check correct type
    it('should return an error if the data is not a string', () => {
      const path: string[] = ['foo', 'bar'];

      const exampleErrors: ValidationError[] = [{ message: 'The value should be string', path: '' }];
      const exampleErrorsWithPath: ValidationError[] = [{ message: 'The value should be string', path: 'foo.bar' }];

      // string
      expect(validator.validate({ type: 'string' }, 'Hello World')).toEqual([]);
      expect(validator.validate({ type: 'string' }, 'Hello World', path)).toEqual([]);

      // number
      expect(validator.validate({ type: 'string' }, 1245)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, 1245, path)).toEqual(exampleErrorsWithPath);

      // true
      expect(validator.validate({ type: 'string' }, true)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, true, path)).toEqual(exampleErrorsWithPath);

      // false
      expect(validator.validate({ type: 'string' }, false)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, false, path)).toEqual(exampleErrorsWithPath);

      // undefined
      expect(validator.validate({ type: 'string' }, undefined)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, undefined, path)).toEqual(exampleErrorsWithPath);

      // Symbol
      expect(validator.validate({ type: 'string' }, Symbol('Hello World'))).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, Symbol('Hello World'), path)).toEqual(exampleErrorsWithPath);

      // null
      expect(validator.validate({ type: 'string' }, null)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, null, path)).toEqual(exampleErrorsWithPath);

      // NaN
      expect(validator.validate({ type: 'string' }, NaN)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, NaN, path)).toEqual(exampleErrorsWithPath);

      // array
      expect(validator.validate({ type: 'string' }, [])).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, [], path)).toEqual(exampleErrorsWithPath);

      // object
      expect(validator.validate({ type: 'string' }, {})).toEqual(exampleErrors);
      expect(validator.validate({ type: 'string' }, {}, path)).toEqual(exampleErrorsWithPath);
    });
  });
});
