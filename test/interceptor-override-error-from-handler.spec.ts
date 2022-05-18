import http from 'http';
import supertest from 'supertest';
import { catchError, throwError } from 'rxjs';
import { HttpException } from '@caviajs/http-exception';
import { HttpRouter } from '../src';

it('interceptor should correctly override the error returned by the handler', async () => {
  const sequence: number[] = [];

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept((request, response, next) => {
      sequence.push(1);

      return next
        .handle()
        .pipe(
          catchError(() => {
            sequence.push(3);

            return throwError(new HttpException(409, 'Hello Cavia'));
          }),
        );
    })
    .route({
      handler: () => {
        sequence.push(2);

        throw new HttpException(400);
      },
      method: 'GET',
      path: '/error',
    });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer).get('/error');

  expect(response.body).toEqual({ statusCode: 409, statusMessage: 'Hello Cavia' });
  expect(response.statusCode).toBe(409);

  expect(sequence).toEqual([1, 2, 3]);
});
