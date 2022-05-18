import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_ARRAY: number[] = [1, 2, 4, 5];

httpRouter
  .route({ handler: () => EXAMPLE_ARRAY, method: 'GET', path: '/array-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_ARRAY), method: 'GET', path: '/array-async' })
  .route({ handler: () => of(EXAMPLE_ARRAY), method: 'GET', path: '/array-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_ARRAY)), method: 'GET', path: '/array-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize array', async () => {
  {
    const raw: string = JSON.stringify(EXAMPLE_ARRAY);

    const response = await supertest(httpServer)
      .get('/array-sync');

    expect(response.body).toEqual(EXAMPLE_ARRAY);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_ARRAY);

    const response = await supertest(httpServer)
      .get('/array-async');

    expect(response.body).toEqual(EXAMPLE_ARRAY);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_ARRAY);

    const response = await supertest(httpServer)
      .get('/array-observable-sync');

    expect(response.body).toEqual(EXAMPLE_ARRAY);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_ARRAY);

    const response = await supertest(httpServer)
      .get('/array-observable-async');

    expect(response.body).toEqual(EXAMPLE_ARRAY);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});
