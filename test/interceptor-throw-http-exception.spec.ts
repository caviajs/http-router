import http from 'http';
import supertest from 'supertest';
import { catchError, tap, throwError } from 'rxjs';
import { HttpException } from '@caviajs/http-exception';
import { HttpRouter } from '../src';

it('should correctly handle HttpException threw by interceptor', async () => {
  const EXCEPTION: HttpException = new HttpException(400, 'Hello Cavia');
  const SEQUENCE: string[] = [];

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      SEQUENCE.push('first:request');

      return next
        .handle()
        .pipe(
          tap(() => {
            SEQUENCE.push('first:response:success');
          }),
          catchError((err) => {
            SEQUENCE.push('first:response:failure');

            return throwError(err);
          }),
        );
    })
    .intercept((request, response, next) => {
      SEQUENCE.push('second:request');

      return next
        .handle()
        .pipe(
          tap(() => {
            SEQUENCE.push('second:response:success');
          }),
          catchError((err) => {
            SEQUENCE.push('second:response:failure');

            return throwError(err);
          }),
        );
    })
    .intercept((request, response, next) => {
      SEQUENCE.push('third:request');

      throw EXCEPTION;

      return next
        .handle()
        .pipe(
          tap(() => {
            SEQUENCE.push('third:response:success');
          }),
          catchError((err) => {
            SEQUENCE.push('third:response:failure');

            return throwError(err);
          }),
        );
    })
    .route({
      handler: () => {
        SEQUENCE.push('handler');
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

  expect(SEQUENCE).toEqual([
    'first:request',
    'second:request',
    'third:request',
    'second:response:failure',
    'first:response:failure',
  ]);
});
