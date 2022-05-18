import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../src';

it('should assign an appropriate path to the request', (done) => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({ handler: (request) => request.path, method: 'GET', path: '/guinea/:first/pigs/:second' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  supertest(httpServer)
    .get('/guinea/1/pigs/2')
    .expect(200, '/guinea/:first/pigs/:second', done);
});
