import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_NUMBER: number = 1245;

httpRouter
  .route({ handler: () => EXAMPLE_NUMBER, method: 'GET', path: '/number-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_NUMBER), method: 'GET', path: '/number-async' })
  .route({ handler: () => of(EXAMPLE_NUMBER), method: 'GET', path: '/number-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_NUMBER)), method: 'GET', path: '/number-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize number', async () => {
  {
    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/number-sync');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/number-async');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/number-observable-sync');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/number-observable-async');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});
