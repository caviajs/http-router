import http from 'http';
import supertest from 'supertest';
import { HttpContract, HttpException, HttpRouter } from '../../../src';

const EXCEPTION: HttpException = new HttpException(415);

it('client that sent the request with the mime type not declared in the schema should receive HttpException(415)', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: () => undefined,
      metadata: {
        contract: {
          request: {
            body: { // metadata.contract.request.body is declared...
              // but no mime type is specified in the schema...
            },
          },
        },
      },
      method: 'POST',
      path: '/',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .post('/')
    .set('Content-Type', 'application/pdf') // and the client provided a application/pdf...
    .send('Hello World');

  expect(response.body).toEqual(EXCEPTION.getResponse());
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXCEPTION.getResponse())).toString());
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(response.statusCode).toBe(415);
});

it('client that sent the request with a mime type other than that declared in the schema should receive HttpException(415)', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: () => undefined,
      metadata: {
        contract: {
          request: {
            body: { // metadata.contract.request.body is declared...
              // only text/plain is declared in the specification...
              'text/plain': { type: 'buffer' },
            },
          },
        },
      },
      method: 'POST',
      path: '/',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .post('/')
    .set('Content-Type', 'application/pdf') // but the client provided a application/pdf...
    .send('Hello World');

  expect(response.body).toEqual(EXCEPTION.getResponse());
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXCEPTION.getResponse())).toString());
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(response.statusCode).toBe(415);
});

it('client that sent the request with the declared MIME type, but the schema type is invalid, should receive HttpException(415)', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: () => undefined,
      metadata: {
        contract: {
          request: {
            body: { // metadata.contract.request.body is declared...
              // application/pdf is declared with invalid schema type...
              // ...so there is no parser for this combination of mime-type and schema type...
              'application/pdf': { type: 'not-existing-type-parser' } as any,
            },
          },
        },
      },
      method: 'POST',
      path: '/',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .post('/')
    .set('Content-Type', 'application/pdf') // client provided a application/pdf...
    .send('Hello World');

  expect(response.body).toEqual(EXCEPTION.getResponse());
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXCEPTION.getResponse())).toString());
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(response.statusCode).toBe(415);
});
