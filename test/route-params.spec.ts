import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../src';

it('should correctly parse route parameters', (done) => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({ handler: (request) => request.params, method: 'GET', path: '/guinea/:first/pigs/:second' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  supertest(httpServer)
    .get('/guinea/12/pigs/34')
    .expect(200, { first: '12', second: '34' }, done);
});
