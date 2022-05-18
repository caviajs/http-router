import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_OBJECT: object = { foo: 'bar' };

httpRouter
  .route({ handler: () => EXAMPLE_OBJECT, method: 'GET', path: '/object-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_OBJECT), method: 'GET', path: '/object-async' })
  .route({ handler: () => of(EXAMPLE_OBJECT), method: 'GET', path: '/object-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_OBJECT)), method: 'GET', path: '/object-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize object', async () => {
  {
    const raw: string = JSON.stringify(EXAMPLE_OBJECT);

    const response = await supertest(httpServer)
      .get('/object-sync');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_OBJECT);

    const response = await supertest(httpServer)
      .get('/object-async');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_OBJECT);

    const response = await supertest(httpServer)
      .get('/object-observable-sync');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }

  {
    const raw: string = JSON.stringify(EXAMPLE_OBJECT);

    const response = await supertest(httpServer)
      .get('/object-observable-sync');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  }
});
