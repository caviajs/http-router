import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../src';

function createServer(): http.Server {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({
      handler: () => {
        throw new Error('Hello Cavia');
      },
      method: 'GET',
      path: '/error',
    });

  return http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });
}

it('should correctly handle Error', (done) => {
  const httpServer: http.Server = createServer();

  supertest(httpServer)
    .get('/error')
    .expect(500, { statusCode: 500, statusMessage: 'Internal Server Error' }, done);
});
