import http from 'http';
import supertest from 'supertest';
import { catchError, throwError } from 'rxjs';
import { HttpException } from '@caviajs/http-exception';
import { HttpRouter } from '../src';

it('interceptor should correctly override the Error returned by the handler', async () => {
  const sequence: number[] = [];

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      sequence.push(1);

      return next.handle().pipe(catchError(() => {
        sequence.push(3);

        return throwError(new HttpException(409, 'Hello Cavia'));
      }));
    })
    .route({
      handler: () => {
        sequence.push(2);

        throw new Error('Hello World');
      },
      method: 'GET',
      path: '/',
    });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  const EXPECTED_BODY = { statusCode: 409, statusMessage: 'Hello Cavia' };

  expect(response.body).toEqual(EXPECTED_BODY);
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXPECTED_BODY)).toString());
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(response.statusCode).toBe(409);

  expect(sequence).toEqual([1, 2, 3]);
});
