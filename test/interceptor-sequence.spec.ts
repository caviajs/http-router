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

describe('Interceptor sequence', () => {
  it('should be executed in the correct order', async () => {
    const sequence: number[] = [];

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      // sync
      .intercept((request, response, next) => {
        sequence.push(10);

        return next.handle().pipe(tap(() => sequence.push(90)));
      })
      // async
      .intercept(async (request, response, next) => {
        sequence.push(20);
        await wait(500, () => sequence.push(21));

        return next.handle().pipe(tap(() => sequence.push(80)));
      });

    httpRouter
      .route({
        handler: async () => {
          sequence.push(50);
          await wait(500, () => sequence.push(51));
          sequence.push(52);
        },
        interceptors: [
          // sync
          (request, response, next) => {
            sequence.push(30);

            return next.handle().pipe(tap(() => sequence.push(70)));
          },
          // async
          async (request, response, next) => {
            sequence.push(40);
            await wait(500, () => sequence.push(41));

            return next.handle().pipe(tap(() => sequence.push(60)));
          },
        ],
        method: 'GET',
        path: '/pigs'
      });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    await supertest(httpServer).get('/pigs');

    expect(sequence).toEqual([10, 20, 21, 30, 40, 41, 50, 51, 52, 60, 70, 80, 90]);
  });
});
