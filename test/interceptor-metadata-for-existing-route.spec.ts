import http from 'http';
import supertest from 'supertest';
import { HttpRouter, RouteMetadata } from '../src';

it('route metadata should be assigned to the request from an existing route and available in interceptors', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  let metadata: RouteMetadata;

  httpRouter
    .intercept((request, response, next) => {
      metadata = request.metadata;

      return next.handle();
    })
    .route({
      handler: () => undefined,
      metadata: {
        permissions: ['read:pigs'],
      },
      method: 'GET',
      path: '/',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/');

  expect(metadata).toEqual({ permissions: ['read:pigs'] });
});
