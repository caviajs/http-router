import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const EXAMPLE_STRING: string = 'Hello World';

it('should correctly serialize string returned by handler', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => EXAMPLE_STRING, method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  }

  // async
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => Promise.resolve(EXAMPLE_STRING), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  }

  // sync + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => of(EXAMPLE_STRING), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  }

  // async + observable
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => Promise.resolve(of(EXAMPLE_STRING)), method: 'GET', path: '/' });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .get('/');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  }
});

it('should correctly overwrite headers after string serialization, if specified in a handler', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter.route({
    handler: (request, response) => {
      response
        .setHeader('content-length', '4')
        .setHeader('content-type', 'application/javascript');

      return EXAMPLE_STRING;
    },
    method: 'GET',
    path: '/',
  });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.headers['content-length']).toBe('4');
  expect(response.headers['content-type']).toBe('application/javascript');
});
