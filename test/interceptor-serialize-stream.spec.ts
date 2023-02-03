import http from 'http';
import supertest from 'supertest';
import { exhaustMap, map, mergeAll, of } from 'rxjs';
import { HttpRouter } from '../src';
import { Readable } from 'stream';

const EXAMPLE_STREAM_DATA: string = 'Hello World';

it('should correctly serialize stream returned by interceptor', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(map(() => Readable.from(EXAMPLE_STREAM_DATA)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  // async
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(Readable.from(EXAMPLE_STREAM_DATA))));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  // sync + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => of(Readable.from(EXAMPLE_STREAM_DATA))));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  // async + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(of(Readable.from(EXAMPLE_STREAM_DATA)))), mergeAll());
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }
});

it('should correctly overwrite the inferred content-type header', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      return next.handle().pipe(map(() => {
        response
          .setHeader('content-type', 'text/css');

        return Readable.from(EXAMPLE_STREAM_DATA);
      }));
    })
    .route({ handler: () => undefined, method: 'GET', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.text).toEqual(EXAMPLE_STREAM_DATA);
  expect(response.headers['content-length']).toBeUndefined();
  expect(response.headers['content-type']).toBe('text/css');
  expect(response.statusCode).toBe(200);
});
