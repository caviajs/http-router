import http from 'http';
import supertest from 'supertest';
import { HttpRouter, RoutePath } from '../src';

it('route path should be undefined in case of non-existent route and available on interceptors', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  let path: RoutePath;

  httpRouter
    .intercept((request, response, next) => {
      path = request.path;

      return next.handle();
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/non-existent-route');

  expect(path).toBeUndefined();
});
