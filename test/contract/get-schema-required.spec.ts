import { getSchemaRequired } from '../../src/contract/get-schema-required';

it('should return false as default value', () => {
  expect(getSchemaRequired(undefined)).toEqual(false);
  expect(getSchemaRequired({})).toEqual(false);
});

it('should return value from property', () => {
  expect(getSchemaRequired({ required: false })).toEqual(false);
  expect(getSchemaRequired({ required: true })).toEqual(true);
});
