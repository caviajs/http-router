import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_FALSE: boolean = false;

httpRouter
  .route({ handler: () => EXAMPLE_FALSE, method: 'GET', path: '/false-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_FALSE), method: 'GET', path: '/false-async' })
  .route({ handler: () => of(EXAMPLE_FALSE), method: 'GET', path: '/false-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_FALSE)), method: 'GET', path: '/false-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize boolean (false)', async () => {
  {
    const raw: string = JSON.stringify(EXAMPLE_FALSE);

    const response = await supertest(httpServer)
      .get('/false-sync');

    expect(response.body).toEqual(EXAMPLE_FALSE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_FALSE);

    const response = await supertest(httpServer)
      .get('/false-async');

    expect(response.body).toEqual(EXAMPLE_FALSE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_FALSE);

    const response = await supertest(httpServer)
      .get('/false-observable-sync');

    expect(response.body).toEqual(EXAMPLE_FALSE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_FALSE);

    const response = await supertest(httpServer)
      .get('/false-observable-async');

    expect(response.body).toEqual(EXAMPLE_FALSE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});
