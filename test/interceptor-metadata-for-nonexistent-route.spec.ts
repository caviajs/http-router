import http from 'http';
import supertest from 'supertest';
import { HttpRouter, RouteMetadata } from '../src';

it('route metadata should be empty in case of non-existent route and available on interceptors', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  let metadata: RouteMetadata;

  httpRouter
    .intercept((request, response, next) => {
      metadata = request.metadata;

      return next.handle();
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/non-existent-route');

  expect(metadata).toBeUndefined();
});
