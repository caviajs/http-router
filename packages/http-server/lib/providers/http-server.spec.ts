import { HTTP_SERVER, HttpServerProvider } from './http-server';
import http from 'http';

describe('HttpServerProvider', () => {
  it('should have the appropriate token', () => {
    expect(HttpServerProvider.provide).toEqual(HTTP_SERVER);
  });

  it('should have the correct value by default', () => {
    expect(HttpServerProvider.useValue).toBeInstanceOf(http.Server);
  });
});
