import http from 'http';
import supertest from 'supertest';
import { catchError, throwError } from 'rxjs';
import { HttpRouter } from '../src';
import { HttpException } from '@caviajs/http-exception';

it('interceptor should correctly override the HttpException returned by the handler', async () => {
  const EXCEPTION: HttpException = new HttpException(409, 'Hello Cavia');
  const SEQUENCE: number[] = [];

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      SEQUENCE.push(1);

      return next.handle().pipe(catchError(() => {
        SEQUENCE.push(3);

        return throwError(EXCEPTION);
      }));
    })
    .route({
      handler: () => {
        SEQUENCE.push(2);

        throw new HttpException(400);
      },
      method: 'GET',
      path: '/',
    });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.body).toEqual(EXCEPTION.getResponse());
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXCEPTION.getResponse())).toString());
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(response.statusCode).toBe(EXCEPTION.getStatus());

  expect(SEQUENCE).toEqual([1, 2, 3]);
});
