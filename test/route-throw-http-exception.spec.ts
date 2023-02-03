import http from 'http';
import supertest from 'supertest';
import { HttpException, HttpRouter } from '../src';

it('should correctly handle HttpException threw by handler', (done) => {
  const httpRouter: HttpRouter = new HttpRouter();

  const EXCEPTION_1: HttpException = new HttpException(401);
  const EXCEPTION_2: HttpException = new HttpException(401, 'Hello Cavia');
  const EXCEPTION_3: HttpException = new HttpException(409, { hello: 'cavia' });

  httpRouter
    .route({
      handler: () => {
        throw EXCEPTION_1;
      },
      method: 'GET',
      path: '/exception-1',
    })
    .route({
      handler: () => {
        throw EXCEPTION_2;
      },
      method: 'GET',
      path: '/exception-2',
    })
    .route({
      handler: () => {
        throw EXCEPTION_3;
      },
      method: 'GET',
      path: '/exception-3',
    });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  supertest(httpServer)
    .get('/exception-1')
    .expect('Content-Length', Buffer.byteLength(JSON.stringify(EXCEPTION_1.getResponse())).toString())
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(EXCEPTION_1.getStatus(), EXCEPTION_1.getResponse(), done);

  supertest(httpServer)
    .get('/exception-2')
    .expect('Content-Length', Buffer.byteLength(JSON.stringify(EXCEPTION_2.getResponse())).toString())
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(EXCEPTION_2.getStatus(), EXCEPTION_2.getResponse(), done);

  supertest(httpServer)
    .get('/exception-3')
    .expect('Content-Length', Buffer.byteLength(JSON.stringify(EXCEPTION_3.getResponse())).toString())
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(EXCEPTION_3.getStatus(), EXCEPTION_3.getResponse(), done);
});
