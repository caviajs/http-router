import http from 'http';
import supertest from 'supertest';
import { exhaustMap, map, mergeAll, of } from 'rxjs';
import { HttpRouter } from '../src';

const EXAMPLE_OBJECT: object = { foo: 'bar' };

it('should correctly serialize object returned by interceptor', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(map(() => EXAMPLE_OBJECT));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_OBJECT)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // async
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(EXAMPLE_OBJECT)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_OBJECT)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // sync + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => of(EXAMPLE_OBJECT)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_OBJECT)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // async + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(of(EXAMPLE_OBJECT))), mergeAll());
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_OBJECT)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});

it('should correctly overwrite the inferred content-type header', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      return next.handle().pipe(map(() => {
        response
          .setHeader('content-type', 'application/json');

        return EXAMPLE_OBJECT;
      }));
    })
    .route({ handler: () => undefined, method: 'GET', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.body).toEqual(EXAMPLE_OBJECT);
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_OBJECT)).toString());
  expect(response.headers['content-type']).toBe('application/json');
  expect(response.statusCode).toBe(200);
});
