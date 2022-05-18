import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_NULL: null = null;

httpRouter
  .route({ handler: () => EXAMPLE_NULL, method: 'GET', path: '/null-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_NULL), method: 'GET', path: '/null-async' })
  .route({ handler: () => of(EXAMPLE_NULL), method: 'GET', path: '/null-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_NULL)), method: 'GET', path: '/null-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize null', async () => {
  {
    const raw: string = JSON.stringify(EXAMPLE_NULL);

    const response = await supertest(httpServer)
      .get('/null-sync');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_NULL);

    const response = await supertest(httpServer)
      .get('/null-async');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_NULL);

    const response = await supertest(httpServer)
      .get('/null-observable-sync');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_NULL);

    const response = await supertest(httpServer)
      .get('/null-observable-async');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});
