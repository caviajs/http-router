import { HTTP_SERVER_PORT, HttpServerPortProvider } from './http-server-port';

describe('HttpServerPortProvider', () => {
  it('should have the appropriate token', () => {
    expect(HttpServerPortProvider.provide).toEqual(HTTP_SERVER_PORT);
  });

  it('should have the correct value by default', () => {
    expect(HttpServerPortProvider.useValue).toEqual(3000);
  });
});
