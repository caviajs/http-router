import http from 'http';
import supertest from 'supertest';
import { map } from 'rxjs';
import { HttpRouter } from '../src';

const EXAMPLE_STRING: string = 'Hello Cavia';

it('interceptor should correctly override the response body returned by the handler', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      return next.handle().pipe(map(() => EXAMPLE_STRING));
    })
    .route({ handler: () => [1, 2, 4, 5], method: 'GET', path: '/' });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.text).toBe(EXAMPLE_STRING);
  expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
  expect(response.headers['content-type']).toBe('text/plain');
  expect(response.statusCode).toBe(200);
});
