import http from 'http';
import supertest from 'supertest';
import { exhaustMap, map, mergeAll, of } from 'rxjs';
import { HttpRouter } from '../src';

const EXAMPLE_TRUE: boolean = true;

it('should correctly serialize true returned by interceptor', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(map(() => EXAMPLE_TRUE));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_TRUE)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // async
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(EXAMPLE_TRUE)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_TRUE)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // sync + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => of(EXAMPLE_TRUE)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_TRUE)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // async + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(of(EXAMPLE_TRUE))), mergeAll());
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_TRUE)).toString());
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

        return EXAMPLE_TRUE;
      }));
    })
    .route({ handler: () => undefined, method: 'GET', path: '/' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.body).toEqual(EXAMPLE_TRUE);
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_TRUE)).toString());
  expect(response.headers['content-type']).toBe('application/json');
  expect(response.statusCode).toBe(200);
});
