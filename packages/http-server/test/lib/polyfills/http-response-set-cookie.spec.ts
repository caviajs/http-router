import http from 'http';
import { HttpRouter, HttpServerTest, serializeCookie } from '../../../src/public-api';

describe('http-response-set-cookie', () => {
  it('should set the correct Set-Cookie header', done => {
    const router = new HttpRouter();

    router.route('GET', '/', (req, res) => {
      try {
        expect(res.getHeader('Set-Cookie')).toBeUndefined();

        res.setCookie('foo', 'foz', { httpOnly: true });

        expect(res.getHeader('Set-Cookie')).toEqual([
          serializeCookie('foo', 'foz', { httpOnly: true }),
        ]);

        res.setCookie('bar', 'baz', { secure: true });

        expect(res.getHeader('Set-Cookie')).toEqual([
          serializeCookie('foo', 'foz', { httpOnly: true }),
          serializeCookie('bar', 'baz', { secure: true }),
        ]);
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
