import http from 'http';
import supertest from 'supertest';
import { HttpRouter, RoutePath } from '../src';

it('route path should be assigned to the request from an existing route and available in interceptors', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  let path: RoutePath;

  httpRouter
    .intercept((request, response, next) => {
      path = request.path;

      return next.handle();
    })
    .route({
      handler: () => undefined,
      method: 'GET',
      path: '/pigs/:id',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/pigs/1');

  expect(path).toBe('/pigs/:id');
});
