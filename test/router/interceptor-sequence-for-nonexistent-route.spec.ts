import http from 'http';
import { catchError, tap, throwError } from 'rxjs';
import supertest from 'supertest';
import { HttpRouter } from '../../src';

function wait(ms: number, cb: () => void): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve();
    }, ms);
  });
}

it('should execute the interceptors in the correct sequence for the nonexistent route', async () => {
  const SEQUENCE: string[] = [];

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    // sync
    .intercept((request, response, next) => {
      SEQUENCE.push('first:request');

      return next.handle().pipe(
        tap(() => {
          SEQUENCE.push('first:response:success');
        }),
        catchError(err => {
          SEQUENCE.push('first:response:failure');

          return throwError(err);
        }),
      );
    })
    // async
    .intercept(async (request, response, next) => {
      SEQUENCE.push('second:request');
      await wait(500, () => SEQUENCE.push('second:request-wait'));

      return next.handle().pipe(
        tap(() => {
          SEQUENCE.push('second:response:success');
        }),
        catchError(err => {
          SEQUENCE.push('second:response:failure');

          return throwError(err);
        }),
      );
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/non-existent-route');

  expect(SEQUENCE).toEqual([
    'first:request',
    'second:request',
    'second:request-wait',
    'second:response:failure',
    'first:response:failure',
  ]);
});
