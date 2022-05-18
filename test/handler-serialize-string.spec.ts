import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_STRING: string = 'Hello World';

httpRouter
  .route({ handler: () => EXAMPLE_STRING, method: 'GET', path: '/string-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_STRING), method: 'GET', path: '/string-async' })
  .route({ handler: () => of(EXAMPLE_STRING), method: 'GET', path: '/string-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_STRING)), method: 'GET', path: '/string-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize string', async () => {
  {
    const response = await supertest(httpServer)
      .get('/string-sync');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/string-async');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/string-observable-sync');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/string-observable-async');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  }
});
