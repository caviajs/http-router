import http from 'http';
import supertest from 'supertest';
import { catchError, tap, throwError } from 'rxjs';
import { HttpException } from '@caviajs/http-exception';
import { HttpRouter } from '../src';

describe('Handling HttpException from interceptor', () => {
  it('should handle HttpException from interceptor correctly', async () => {
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

        throw new HttpException(400, 'Hello Cavia');

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
        path: '/error',
      });

    const httpServer: http.Server = http.createServer(async (request, response) => {
      await httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer).get('/error');

    expect(response.body).toEqual({ statusCode: 400, statusMessage: 'Hello Cavia' });
    expect(response.statusCode).toBe(400);

    expect(sequence).toEqual([
      'first:request',
      'second:request',
      'third:request',
      'second:response:failure',
      'first:response:failure',
    ]);
  });
});
