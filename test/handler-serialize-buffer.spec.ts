import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_BUFFER: Buffer = Buffer.from('Hello World');

httpRouter
  .route({ handler: () => EXAMPLE_BUFFER, method: 'GET', path: '/buffer-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_BUFFER), method: 'GET', path: '/buffer-async' })
  .route({ handler: () => of(EXAMPLE_BUFFER), method: 'GET', path: '/buffer-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_BUFFER)), method: 'GET', path: '/buffer-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize buffer', async () => {
  {
    const response = await supertest(httpServer)
      .get('/buffer-sync');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/buffer-async');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/buffer-observable-sync');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/buffer-observable-async');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }
});
