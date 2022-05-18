import http from 'http';
import { of } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_UNDEFINED: undefined = undefined;

httpRouter
  .route({ handler: () => EXAMPLE_UNDEFINED, method: 'GET', path: '/undefined-sync' })
  .route({ handler: () => Promise.resolve(EXAMPLE_UNDEFINED), method: 'GET', path: '/undefined-async' })
  .route({ handler: () => of(EXAMPLE_UNDEFINED), method: 'GET', path: '/undefined-observable-sync' })
  .route({ handler: () => Promise.resolve(of(EXAMPLE_UNDEFINED)), method: 'GET', path: '/undefined-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize undefined', async () => {
  {
    const response = await supertest(httpServer)
      .get('/undefined-sync');

    expect(response.type).toBe('');
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/undefined-async');

    expect(response.type).toBe('');
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/undefined-observable-sync');

    expect(response.type).toBe('');
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/undefined-observable-async');

    expect(response.type).toBe('');
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  }
});
