import http from 'http';
import { HttpRouter, HttpServerTest } from '../../../src/public-api';

describe('http-response-remove-cookie', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call setCookie with valid parameters', done => {
    const router = new HttpRouter();

    router.route('GET', '/', (req, res) => {
      try {
        const setCookieSpy = jest.spyOn(http.ServerResponse.prototype, 'setCookie');

        res.removeCookie('foo');

        expect(setCookieSpy).toHaveBeenCalledTimes(1);
        expect(setCookieSpy).toHaveBeenCalledWith('foo', '', { maxAge: 0, expires: new Date(0) });
        done();
      } catch (error) {
        done(error);
      }
    });

    const server = http
      .createServer((req, res) => router.handle(req, res));

    HttpServerTest
      .get(server, '/');
  });
});
