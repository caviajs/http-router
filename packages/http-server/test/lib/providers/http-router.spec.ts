import http from 'http';
import { Readable } from 'stream';
import { HttpException, HttpRouter, HttpServerTest } from '../../../src/public-api';

describe('HttpRouter', () => {
  describe('routing', () => {
    it('should handle the correct route', async () => {
      const router = new HttpRouter();

      const fooGet = jest.fn();
      const fooPost = jest.fn();
      const barGet = jest.fn();

      router.route('GET', 'foo', fooGet);
      router.route('POST', 'foo', fooPost);
      router.route('GET', 'bar', barGet);

      const server = http
        .createServer((req, res) => router.handle(req, res));

      await HttpServerTest
        .get(server, 'foo');

      expect(fooGet).toHaveBeenCalledTimes(1);
      expect(fooPost).not.toHaveBeenCalled();
      expect(barGet).toHaveBeenCalledTimes(0);

      await HttpServerTest
        .get(server, 'bar');

      expect(fooGet).toHaveBeenCalledTimes(1);
      expect(fooPost).not.toHaveBeenCalled();
      expect(barGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when routes are duplicated', () => {
      const cb = async () => {
        const router = new HttpRouter();

        router.route('GET', 'foo', jest.fn());
        router.route('GET', 'foo', jest.fn());
      };

      expect(cb).rejects.toThrowError('Duplicated {/foo, GET} HTTP route');
    });
  });

  describe('exception handling', () => {
    it('should handle an http exception from the route', async () => {
      const router = new HttpRouter();

      router.route('GET', '/', () => {
        throw new HttpException(404);
      });

      const server = http
        .createServer((req, res) => router.handle(req, res));

      const result = await HttpServerTest
        .get(server, '/', { responseType: 'json' });

      expect(result.body).toEqual({ statusCode: 404, statusMessage: 'Not Found' });
      expect(result.headers['content-type']).toEqual('application/json; charset=utf-8');
      expect(result.statusCode).toEqual(404);
    });

    // it('should handle an http exception from a custom catcher', async () => {
    //   const router = new HttpRouter({
    //     catcher: () => new HttpException(400),
    //   });
    //
    //   router.route('GET', '/', () => {
    //     throw new HttpException(404);
    //   });
    //
    //   const server = http
    //     .createServer((req, res) => router.handle(req, res));
    //
    //   const result = await HttpServerTest
    //     .get(server, '/', { responseType: 'json' });
    //
    //   expect(result.body).toEqual({ statusCode: 400, statusMessage: 'Bad Request' });
    //   expect(result.headers['content-type']).toBe('application/json; charset=utf-8');
    //   expect(result.statusCode).toBe(400);
    // });
  });

  describe('response serialization', () => {
    const router = new HttpRouter();

    // undefined
    router.route('GET', 'undefined', () => undefined);

    // buffer
    router.route('GET', 'buffer', () => Buffer.from([1, 2, 3]));

    // stream
    router.route('GET', 'stream', () => {
      const stream = new Readable();

      stream.push('Hello World');
      stream.push(null);

      return stream;
    });

    // string
    router.route('GET', 'string', () => 'Hello World');

    // JSON (true, false, number, null, array, object) but without string
    router.route('GET', 'true', () => true);
    router.route('GET', 'false', () => false);
    router.route('GET', 'number', () => 1245);
    router.route('GET', 'null', () => null);
    router.route('GET', 'array', () => [1, 2, 3]);
    router.route('GET', 'object', () => ({ hello: 'world' }));

    const server = http.createServer((req, res) => router.handle(req, res));

    it('undefined', async () => {
      const result = await HttpServerTest
        .get(server, 'undefined');

      expect(result.body.length).toBe(0);
    });

    it('buffer', async () => {
      const result = await HttpServerTest
        .get(server, 'buffer');

      expect(result.body).toEqual(Buffer.from([1, 2, 3]));
      expect(result.headers['content-type']).toBe('application/octet-stream');
      expect(result.headers['content-length']).toBe('3');
    });

    it('stream', done => {
      HttpServerTest
        .get(server, 'stream', { responseType: 'stream' })
        .then(result => {
          expect(result.headers['content-type']).toBe('application/octet-stream');
          expect(result.headers['content-length']).toBeUndefined();

          let data: Buffer = Buffer.alloc(0);

          result.body.on('data', (chunk: Buffer) => {
            data = Buffer.concat([data, chunk]);
          });

          result.body.on('end', () => {
            expect(data.toString()).toBe('Hello World');

            done();
          });
        });
    });

    it('string', async () => {
      const result = await HttpServerTest
        .get(server, 'string', { responseType: 'text' });

      expect(result.body).toBe('Hello World');
      expect(result.headers['content-type']).toBe('text/plain');
      expect(result.headers['content-length']).toBe('11');
    });

    it('true', async () => {
      const result = await HttpServerTest
        .get(server, 'true', { responseType: 'json' });

      expect(result.body).toBe(true);
      expect(result.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result.headers['content-length']).toBe('4');
    });

    it('false', async () => {
      const result = await HttpServerTest
        .get(server, 'false', { responseType: 'json' });

      expect(result.body).toBe(false);
      expect(result.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result.headers['content-length']).toBe('5');
    });

    it('number', async () => {
      const result = await HttpServerTest
        .get(server, 'number', { responseType: 'json' });

      expect(result.body).toBe(1245);
      expect(result.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result.headers['content-length']).toBe('4');
    });

    it('null', async () => {
      const result = await HttpServerTest
        .get(server, 'null', { responseType: 'json' });

      expect(result.body).toBe(null);
      expect(result.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result.headers['content-length']).toBe('4');
    });

    it('array', async () => {
      const result = await HttpServerTest
        .get(server, 'array', { responseType: 'json' });

      expect(result.body).toEqual([1, 2, 3]);
      expect(result.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result.headers['content-length']).toBe('7');
    });

    it('object', async () => {
      const result = await HttpServerTest
        .get(server, 'object', { responseType: 'json' });

      expect(result.body).toEqual({ hello: 'world' });
      expect(result.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(result.headers['content-length']).toBe('17');
    });
  });
});
