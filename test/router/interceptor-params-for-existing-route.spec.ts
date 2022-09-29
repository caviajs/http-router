import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../../src';

it('route params should be assigned to the request from an existing route and available in interceptors', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  let params: http.Params;

  httpRouter
    .intercept((request, response, next) => {
      params = request.params;

      return next.handle();
    })
    .route({
      handler: () => undefined,
      method: 'GET',
      path: '/guinea/:first/pigs/:second',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/guinea/12/pigs/34');

  expect(params).toEqual({ first: '12', second: '34' });
});
