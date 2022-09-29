import { getSchemaStrict } from '../../src/contract/get-schema-strict';

it('should return false as default value', () => {
  expect(getSchemaStrict(undefined)).toEqual(false);
  expect(getSchemaStrict({})).toEqual(false);
});

it('should return value from property', () => {
  expect(getSchemaStrict({ strict: false })).toEqual(false);
  expect(getSchemaStrict({ strict: true })).toEqual(true);
});
