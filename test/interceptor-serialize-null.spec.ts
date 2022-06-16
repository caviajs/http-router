import http from 'http';
import supertest from 'supertest';
import { exhaustMap, map, mergeAll, of } from 'rxjs';
import { HttpRouter } from '../src';

const EXAMPLE_NULL: boolean = false;

describe('interceptor serialize null', () => {
  it('should correctly serialize null returned by interceptor', async () => {
    // sync
    {
      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept((request, response, next) => {
          return next.handle().pipe(map(() => EXAMPLE_NULL));
        })
        .route({ handler: () => undefined, method: 'GET', path: '/' });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      const raw: string = JSON.stringify(EXAMPLE_NULL);

      const response = await supertest(httpServer)
        .get('/');

      expect(response.body).toEqual(EXAMPLE_NULL);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    // async
    {
      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept((request, response, next) => {
          return next.handle().pipe(exhaustMap(() => Promise.resolve(EXAMPLE_NULL)));
        })
        .route({ handler: () => undefined, method: 'GET', path: '/' });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      const raw: string = JSON.stringify(EXAMPLE_NULL);

      const response = await supertest(httpServer)
        .get('/');

      expect(response.body).toEqual(EXAMPLE_NULL);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    // sync + observable
    {
      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept((request, response, next) => {
          return next.handle().pipe(exhaustMap(() => of(EXAMPLE_NULL)));
        })
        .route({ handler: () => undefined, method: 'GET', path: '/' });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      const raw: string = JSON.stringify(EXAMPLE_NULL);

      const response = await supertest(httpServer)
        .get('/');

      expect(response.body).toEqual(EXAMPLE_NULL);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    // async + observable
    {
      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept((request, response, next) => {
          return next.handle().pipe(exhaustMap(() => Promise.resolve(of(EXAMPLE_NULL))), mergeAll());
        })
        .route({ handler: () => undefined, method: 'GET', path: '/' });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      const raw: string = JSON.stringify(EXAMPLE_NULL);

      const response = await supertest(httpServer)
        .get('/');

      expect(response.body).toEqual(EXAMPLE_NULL);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly overwrite headers after null serialization, if specified in the interceptor', async () => {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(map(() => {
          response
            .setHeader('content-length', '4')
            .setHeader('content-type', 'application/json');

          return EXAMPLE_NULL;
        }));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.headers['content-length']).toBe('4');
    expect(response.headers['content-type']).toBe('application/json');
  });
});
