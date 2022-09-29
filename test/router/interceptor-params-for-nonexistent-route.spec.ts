import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../../src';

it('route params should be empty in case of non-existent route and available in interceptors', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  let params: http.Params;

  httpRouter
    .intercept((request, response, next) => {
      params = request.params;

      return next.handle();
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/non-existent-route');

  expect(params).toEqual({});
});
