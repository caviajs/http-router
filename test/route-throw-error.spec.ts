import http from 'http';
import supertest from 'supertest';
import { HttpException, HttpRouter } from '../src';

it('should correctly handle Error threw by handler', (done) => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({
      handler: () => {
        throw new Error('Hello Cavia');
      },
      method: 'GET',
      path: '/',
    });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  const EXCEPTION: HttpException = new HttpException(500);

  supertest(httpServer)
    .get('/')
    .expect('Content-Length', Buffer.byteLength(JSON.stringify(EXCEPTION.getResponse())).toString())
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(EXCEPTION.getStatus(), EXCEPTION.getResponse(), done);
});
