import http from 'http';
import { HttpRouter, HttpServerTest } from '../../../src/public-api';

describe('http-request-params', () => {
  it('should handle correct route params', done => {
    const router = new HttpRouter();

    router.route('GET', 'hello-world/:foo/:bar', req => {
      try {
        expect(req.params).toEqual({ foo: '12', bar: '45' });

        done();
      } catch (error) {
        done(error);
      }
    });

    const server = http
      .createServer((req, res) => router.handle(req, res));

    HttpServerTest
      .get(server, 'hello-world/12/45');
  });
});
