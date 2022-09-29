import { HttpRouter } from '../../src';
import { tap } from 'rxjs';
import http from 'http';
import supertest from 'supertest';

function wait(ms: number, cb: () => void): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve();
    }, ms);
  });
}

it('should execute the interceptors in the correct sequence for the existing route', async () => {
  const SEQUENCE: string[] = [];

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    // sync
    .intercept((request, response, next) => {
      SEQUENCE.push('first:request');

      return next.handle().pipe(tap(() => SEQUENCE.push('first:response:success')));
    })
    // async
    .intercept(async (request, response, next) => {
      SEQUENCE.push('second:request');
      await wait(500, () => SEQUENCE.push('second:request-wait'));

      return next.handle().pipe(tap(() => SEQUENCE.push('second:response:success')));
    });

  httpRouter
    .route({
      handler: async () => {
        SEQUENCE.push('handler');
        await wait(500, () => SEQUENCE.push('handler-wait'));
      },
      interceptors: [
        // sync
        (request, response, next) => {
          SEQUENCE.push('third:request');

          return next.handle().pipe(tap(() => SEQUENCE.push('third:response:success')));
        },
        // async
        async (request, response, next) => {
          SEQUENCE.push('fourth:request');
          await wait(500, () => SEQUENCE.push('fourth:request-wait'));

          return next.handle().pipe(tap(() => SEQUENCE.push('fourth:response:success')));
        },
      ],
      method: 'GET',
      path: '/pigs'
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer).get('/pigs');

  expect(SEQUENCE).toEqual([
    'first:request',
    'second:request',
    'second:request-wait',
    'third:request',
    'fourth:request',
    'fourth:request-wait',
    'handler',
    'handler-wait',
    'fourth:response:success',
    'third:response:success',
    'second:response:success',
    'first:response:success',
  ]);
});
