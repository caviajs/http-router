import { generateStructure } from '../../src/contract/generate-structure';

describe('SchemaArray', () => {
  expect(generateStructure({ items: { type: 'array' }, type: 'array' })).toBe('unknown[][]');
  expect(generateStructure({ items: { type: 'boolean' }, type: 'array' })).toBe('boolean[]');
  expect(generateStructure({ items: { enum: ['Hello', 'World'], type: 'enum' }, type: 'array' })).toBe(`('Hello'|'World')[]`);
  expect(generateStructure({ items: { type: 'number' }, type: 'array' })).toBe('number[]');
  expect(generateStructure({ items: { type: 'object' }, type: 'array' })).toBe('{[name: string]: any;}[]');
  expect(generateStructure({
    items: { properties: { foo: { type: 'string' } }, type: 'object' },
    type: 'array'
  })).toBe(`{'foo'?: string;[name: string]: any;}[]`);
  expect(generateStructure({ items: { type: 'string' }, type: 'array' })).toBe('string[]');
  expect(generateStructure({ type: 'array' })).toBe('unknown[]');
});

describe('SchemaBoolean', () => {
  it('should return boolean', () => {
    expect(generateStructure({ type: 'boolean' })).toBe('boolean');
  });
});

describe('SchemaBuffer', () => {
  it('should return Buffer', () => {
    expect(generateStructure({ type: 'buffer' })).toBe('Buffer');
  });
});

describe('SchemaEnum', () => {
  it('should return union type', () => {
    expect(generateStructure({ enum: ['Hello', 'World'], type: 'enum' })).toBe(`'Hello'|'World'`);
  });
});

describe('SchemaNumber', () => {
  it('should return number', () => {
    expect(generateStructure({ type: 'number' })).toBe('number');
  });
});

describe('SchemaObject', () => {
  it('nullable', () => {
    expect(generateStructure({ type: 'object' })).toBe('{[name: string]: any;}');
    expect(generateStructure({ nullable: false, type: 'object' })).toBe('{[name: string]: any;}');
    expect(generateStructure({ nullable: true, type: 'object' })).toBe('{[name: string]: any;}|null');
  });

  it('properties', () => {
    const result = generateStructure({
      properties: {
        foo: { type: 'string' },
        bar: { required: true, type: 'number' },
        baz: { nullable: true, type: 'number' },
      },
      type: 'object'
    });

    expect(result).toBe(`{'foo'?: string;'bar': number;'baz'?: number|null;[name: string]: any;}`);
  });

  it('strict', () => {
    expect(generateStructure({ type: 'object' })).toBe('{[name: string]: any;}');
    expect(generateStructure({ strict: false, type: 'object' })).toBe('{[name: string]: any;}');
    expect(generateStructure({ strict: true, type: 'object' })).toBe('{}');
  });
});

describe('SchemaStream', () => {
  it('should return Readable', () => {
    expect(generateStructure({ type: 'stream' })).toBe('Readable');
  });
});

describe('SchemaString', () => {
  it('should return string', () => {
    expect(generateStructure({ type: 'string' })).toBe('string');
  });
});
