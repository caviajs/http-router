import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const EXAMPLE_NULL: null = null;

it('should correctly serialize null returned by handler', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => EXAMPLE_NULL, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_NULL)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // async
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => Promise.resolve(EXAMPLE_NULL), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_NULL)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // sync + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => of(EXAMPLE_NULL), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_NULL)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  // async + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => Promise.resolve(of(EXAMPLE_NULL)), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_NULL)).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});

it('should correctly overwrite the inferred content-type header', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter.route({
    handler: (request, response) => {
      response
        .setHeader('content-type', 'application/json');

      return EXAMPLE_NULL;
    },
    method: 'GET',
    path: '/',
  });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.body).toEqual(EXAMPLE_NULL);
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXAMPLE_NULL)).toString());
  expect(response.headers['content-type']).toBe('application/json');
  expect(response.statusCode).toBe(200);
});
