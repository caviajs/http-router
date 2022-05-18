import http from 'http';
import supertest from 'supertest';
import { exhaustMap, map, mergeAll, of } from 'rxjs';
import { HttpRouter } from '../src';

const EXAMPLE_BUFFER: Buffer = Buffer.from('Hello Cavia');

it('should correctly serialize buffer returned by interceptor', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(map(() => EXAMPLE_BUFFER));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const raw: string = JSON.stringify(EXAMPLE_BUFFER);

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  // async
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(EXAMPLE_BUFFER)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const raw: string = JSON.stringify(EXAMPLE_BUFFER);

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  // sync + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => of(EXAMPLE_BUFFER)));
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const raw: string = JSON.stringify(EXAMPLE_BUFFER);

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  // async + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept((request, response, next) => {
        return next.handle().pipe(exhaustMap(() => Promise.resolve(of(EXAMPLE_BUFFER))), mergeAll());
      })
      .route({ handler: () => undefined, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const raw: string = JSON.stringify(EXAMPLE_BUFFER);

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }
});
