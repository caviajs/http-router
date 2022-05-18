import http from 'http';
import supertest from 'supertest';
import { catchError, tap, throwError } from 'rxjs';
import { HttpRouter } from '../src';

it('should correctly handle Error threw by interceptor', async () => {
  const sequence: string[] = [];

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      sequence.push('first:request');

      return next
        .handle()
        .pipe(
          tap(() => {
            sequence.push('first:response:success');
          }),
          catchError((err) => {
            sequence.push('first:response:failure');

            return throwError(err);
          }),
        );
    })
    .intercept((request, response, next) => {
      sequence.push('second:request');

      return next
        .handle()
        .pipe(
          tap(() => {
            sequence.push('second:response:success');
          }),
          catchError((err) => {
            sequence.push('second:response:failure');

            return throwError(err);
          }),
        );
    })
    .intercept((request, response, next) => {
      sequence.push('third:request');

      throw new Error('Hello Cavia');

      return next
        .handle()
        .pipe(
          tap(() => {
            sequence.push('third:response:success');
          }),
          catchError((err) => {
            sequence.push('third:response:failure');

            return throwError(err);
          }),
        );
    })
    .route({
      handler: () => {
        sequence.push('handler');
      },
      method: 'GET',
      path: '/',
    });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  expect(response.body).toEqual({ statusCode: 500, statusMessage: 'Internal Server Error' });
  expect(response.statusCode).toBe(500);

  expect(sequence).toEqual([
    'first:request',
    'second:request',
    'third:request',
    'second:response:failure',
    'first:response:failure',
  ]);
});
