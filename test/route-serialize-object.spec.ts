import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const EXAMPLE_OBJECT: object = { foo: 'bar' };

it('should correctly serialize object returned by handler', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => EXAMPLE_OBJECT, method: 'GET', path: '/' });

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

    httpRouter.route({ handler: () => Promise.resolve(EXAMPLE_OBJECT), method: 'GET', path: '/' });

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

    httpRouter.route({ handler: () => of(EXAMPLE_OBJECT), method: 'GET', path: '/' });

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

    httpRouter.route({ handler: () => Promise.resolve(of(EXAMPLE_OBJECT)), method: 'GET', path: '/' });

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

  httpRouter.route({
    handler: (request, response) => {
      response
        .setHeader('content-type', 'application/json');

      return EXAMPLE_OBJECT;
    },
    method: 'GET',
    path: '/',
  });

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
