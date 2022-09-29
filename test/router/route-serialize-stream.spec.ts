import http from 'http';
import { of } from 'rxjs';
import { Readable } from 'stream';
import supertest from 'supertest';
import { HttpRouter } from '../../src';

const EXAMPLE_STREAM_DATA: string = 'Hello World';

it('should correctly serialize stream returned by handler', async () => {
  // sync
  {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter.route({ handler: () => Readable.from(EXAMPLE_STREAM_DATA), method: 'GET', path: '/' });

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

    httpRouter.route({ handler: () => Promise.resolve(Readable.from(EXAMPLE_STREAM_DATA)), method: 'GET', path: '/' });

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

    httpRouter.route({ handler: () => of(Readable.from(EXAMPLE_STREAM_DATA)), method: 'GET', path: '/' });

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

    httpRouter.route({ handler: () => Promise.resolve(of(Readable.from(EXAMPLE_STREAM_DATA))), method: 'GET', path: '/' });

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

  httpRouter.route({
    handler: (request, response) => {
      response
        .setHeader('content-type', 'text/css');

      return Readable.from(EXAMPLE_STREAM_DATA);
    },
    method: 'GET',
    path: '/',
  });

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
