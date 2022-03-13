import { HTTP_GLOBAL_PREFIX, HttpGlobalPrefixProvider } from './http-global-prefix';

describe('HttpGlobalPrefixProvider', () => {
  it('should have the appropriate token', () => {
    expect(HttpGlobalPrefixProvider.provide).toEqual(HTTP_GLOBAL_PREFIX);
  });

  it('should have the correct path by default', () => {
    expect(HttpGlobalPrefixProvider.useValue).toEqual('/');
  });
});
