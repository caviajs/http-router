import http from 'http';
import supertest from 'supertest';
import { exhaustMap, map, mergeAll, of } from 'rxjs';
import { HttpRouter } from '../src';

const EXAMPLE_UNDEFINED: undefined = undefined;

it('should correctly serialize undefined returned by interceptor', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(map(() => EXAMPLE_UNDEFINED));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual({});
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  }

  // async
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(EXAMPLE_UNDEFINED)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual({});
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  }

  // sync + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => of(EXAMPLE_UNDEFINED)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual({});
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  }

  // async + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(of(EXAMPLE_UNDEFINED))), mergeAll());
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual({});
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  }
});

it('should correctly overwrite the inferred content-type header', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      return next.handle().pipe(map(() => {
        response
          .setHeader('content-length', '0')
          .setHeader('content-type', 'application/json');

        return EXAMPLE_UNDEFINED;
      }));
    })
    .route({ handler: () => undefined, method: 'GET', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.body).toEqual('');
  expect(response.headers['content-length']).toBe('0');
  expect(response.headers['content-type']).toBe('application/json');
  expect(response.statusCode).toBe(200);
});
