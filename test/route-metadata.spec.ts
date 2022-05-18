import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../src';

it('should assign an appropriate metadata to the request', (done) => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({
      handler: (request) => request.metadata,
      metadata: {
        permissions: ['read:pigs'],
      },
      method: 'GET',
      path: '/',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  supertest(httpServer)
    .get('/')
    .expect(200, { permissions: ['read:pigs'] }, done);
});
