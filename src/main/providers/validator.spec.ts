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
    // number
    // 1) nullable
    // 2) required
    // 3) check correct type

    it('should return an error if the data is not a string', () => {
      const path: string[] = ['foo', 'bar'];

      const exampleErrors: ValidationError[] = [{ message: 'The value should be number', path: '' }];
      const exampleErrorsWithPath: ValidationError[] = [{ message: 'The value should be number', path: 'foo.bar' }];

      // string
      expect(validator.validate({ type: 'number' }, 'Hello World')).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, 'Hello World', path)).toEqual(exampleErrorsWithPath);

      // number
      expect(validator.validate({ type: 'number' }, 1245)).toEqual([]);
      expect(validator.validate({ type: 'number' }, 1245, path)).toEqual([]);

      // true
      expect(validator.validate({ type: 'number' }, true)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, true, path)).toEqual(exampleErrorsWithPath);

      // false
      expect(validator.validate({ type: 'number' }, false)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, false, path)).toEqual(exampleErrorsWithPath);

      // undefined
      expect(validator.validate({ type: 'number' }, undefined)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, undefined, path)).toEqual(exampleErrorsWithPath);

      // Symbol
      expect(validator.validate({ type: 'number' }, Symbol('Hello World'))).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, Symbol('Hello World'), path)).toEqual(exampleErrorsWithPath);

      // null
      expect(validator.validate({ type: 'number' }, null)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, null, path)).toEqual(exampleErrorsWithPath);

      // NaN
      expect(validator.validate({ type: 'number' }, NaN)).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, NaN, path)).toEqual(exampleErrorsWithPath);

      // array
      expect(validator.validate({ type: 'number' }, [])).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, [], path)).toEqual(exampleErrorsWithPath);

      // object
      expect(validator.validate({ type: 'number' }, {})).toEqual(exampleErrors);
      expect(validator.validate({ type: 'number' }, {}, path)).toEqual(exampleErrorsWithPath);
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
    // 2) required
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
