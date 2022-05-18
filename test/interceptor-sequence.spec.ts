import { HttpRouter } from '../src';
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

it('should execute the interceptors in the correct sequence', async () => {
  const SEQUENCE: number[] = [];

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    // sync
    .intercept((request, response, next) => {
      SEQUENCE.push(10);

      return next.handle().pipe(tap(() => SEQUENCE.push(90)));
    })
    // async
    .intercept(async (request, response, next) => {
      SEQUENCE.push(20);
      await wait(500, () => SEQUENCE.push(21));

      return next.handle().pipe(tap(() => SEQUENCE.push(80)));
    });

  httpRouter
    .route({
      handler: async () => {
        SEQUENCE.push(50);
        await wait(500, () => SEQUENCE.push(51));
        SEQUENCE.push(52);
      },
      interceptors: [
        // sync
        (request, response, next) => {
          SEQUENCE.push(30);

          return next.handle().pipe(tap(() => SEQUENCE.push(70)));
        },
        // async
        async (request, response, next) => {
          SEQUENCE.push(40);
          await wait(500, () => SEQUENCE.push(41));

          return next.handle().pipe(tap(() => SEQUENCE.push(60)));
        },
      ],
      method: 'GET',
      path: '/pigs'
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer).get('/pigs');

  expect(SEQUENCE).toEqual([10, 20, 21, 30, 40, 41, 50, 51, 52, 60, 70, 80, 90]);
});
