import http from 'http';
import { of } from 'rxjs';
import { Readable } from 'stream';
import supertest from 'supertest';
import { HttpRouter } from '../src';

const httpRouter: HttpRouter = new HttpRouter();

const EXAMPLE_STREAM_DATA: string = 'Hello World';

httpRouter
  .route({ handler: () => Readable.from(EXAMPLE_STREAM_DATA), method: 'GET', path: '/stream-sync' })
  .route({ handler: () => Promise.resolve(Readable.from(EXAMPLE_STREAM_DATA)), method: 'GET', path: '/stream-async' })
  .route({ handler: () => of(Readable.from(EXAMPLE_STREAM_DATA)), method: 'GET', path: '/stream-observable-sync' })
  .route({ handler: () => Promise.resolve(of(Readable.from(EXAMPLE_STREAM_DATA))), method: 'GET', path: '/stream-observable-async' });

const httpServer: http.Server = http.createServer((request, response) => {
  httpRouter.handle(request, response);
});

it('should correctly serialize stream', async () => {
  {
    const response = await supertest(httpServer)
      .get('/stream-sync');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/stream-async');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/stream-observable-sync');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }

  {
    const response = await supertest(httpServer)
      .get('/stream-observable-async');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  }
});
