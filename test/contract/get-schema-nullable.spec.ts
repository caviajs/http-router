import { getSchemaNullable } from '../../src/contract/get-schema-nullable';

it('should return false as default value', () => {
  expect(getSchemaNullable(undefined)).toEqual(false);
  expect(getSchemaNullable({})).toEqual(false);
});

it('should return value from property', () => {
  expect(getSchemaNullable({ nullable: false })).toEqual(false);
  expect(getSchemaNullable({ nullable: true })).toEqual(true);
});
