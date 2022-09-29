import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../../src';

const EXAMPLE_BUFFER: Buffer = Buffer.from('Hello Cavia');

it('should correctly serialize buffer returned by handler', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => EXAMPLE_BUFFER, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

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

    httpRouter.route({ handler: () => Promise.resolve(EXAMPLE_BUFFER), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

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

    httpRouter.route({ handler: () => of(EXAMPLE_BUFFER), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

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

    httpRouter.route({ handler: () => Promise.resolve(of(EXAMPLE_BUFFER)), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }
});

it('should correctly overwrite the inferred content-type header', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter.route({
    handler: (request, response) => {
      response
        .setHeader('content-type', 'text/css');

      return EXAMPLE_BUFFER;
    },
    method: 'GET',
    path: '/',
  });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.text).toEqual(EXAMPLE_BUFFER.toString());
  expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
  expect(response.headers['content-type']).toBe('text/css');
  expect(response.statusCode).toBe(200);
});
