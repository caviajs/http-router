import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_TRUE: boolean = true;

httpRouter
  .route({ handler: () => EXAMPLE_TRUE, method: 'GET', path: '/true-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_TRUE), method: 'GET', path: '/true-async' })
  .route({ handler: () => of(EXAMPLE_TRUE), method: 'GET', path: '/true-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_TRUE)), method: 'GET', path: '/true-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize boolean (true)', async () => {
  {
    const raw: string = JSON.stringify(EXAMPLE_TRUE);

    const response = await supertest(httpServer)
      .get('/true-sync');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_TRUE);

    const response = await supertest(httpServer)
      .get('/true-async');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_TRUE);

    const response = await supertest(httpServer)
      .get('/true-observable-sync');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_TRUE);

    const response = await supertest(httpServer)
      .get('/true-observable-async');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});
