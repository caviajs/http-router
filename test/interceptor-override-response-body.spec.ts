import http from 'http';
import supertest from 'supertest';
import { map } from 'rxjs';
import { HttpRouter } from '../src';

it('interceptor should correctly override the response body returned by the handler', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      return next
        .handle()
        .pipe(
          map(() => {
            return 'Hello Cavia';
          }),
        );
    })
    .route({
      handler: () => {
        return 'Hello World';
      },
      method: 'GET',
      path: '/',
    });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer).get('/');

  expect(response.text).toBe('Hello Cavia');
  expect(response.statusCode).toBe(200);
});
