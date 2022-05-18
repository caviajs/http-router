import http from 'http';
import supertest from 'supertest';
import { HttpException } from '@caviajs/http-exception';
import { HttpRouter } from '../src';

it('should thrown an HttpException(404) for a non-existent route', (done) => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({ handler: () => 'GET /pigs', method: 'GET', path: '/pigs' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const EXCEPTION: HttpException = new HttpException(404, 'Route not found');

  supertest(httpServer)
    .get('/non-existent-route')
    .expect('Content-Length', Buffer.byteLength(JSON.stringify(EXCEPTION.getResponse())).toString())
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(EXCEPTION.getStatus(), EXCEPTION.getResponse(), done);
});
