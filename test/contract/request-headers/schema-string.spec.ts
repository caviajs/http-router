import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaString, ValidationError, HttpRouter } from '../../../src';
import * as schemaString from '../../../src/contract/schema-string';

const HEADER_NAME: string = 'x-cavia';
const HEADER_VALUE: string = 'hello';
const HEADER_SCHEMA: SchemaString = { type: 'string' };
const PATH: string[] = ['request', 'headers', HEADER_NAME];

describe('SchemaString', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to string and then call validateSchemaString', async () => {
    const validateSchemaStringSpy = jest.spyOn(schemaString, 'validateSchemaString');

    let header: any;

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: (request) => {
          header = request.headers[HEADER_NAME];
        },
        metadata: {
          contract: {
            request: {
              headers: {
                [HEADER_NAME]: HEADER_SCHEMA,
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

    await supertest(httpServer)
      .post('/')
      .set(HEADER_NAME, HEADER_VALUE);

    expect(typeof header).toEqual('string');
    expect(header).toEqual(HEADER_VALUE);

    expect(validateSchemaStringSpy).toHaveBeenNthCalledWith(1, HEADER_SCHEMA, HEADER_VALUE, PATH);
  });

  it('header declared in the schema but not passed by the client should not exist in the request.headers object', async () => {
    let headerExists: boolean;

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: (request) => {
          headerExists = Object.keys(request.headers).includes(HEADER_NAME);
        },
        metadata: {
          contract: {
            request: {
              headers: {
                // declared in schema
                [HEADER_NAME]: HEADER_SCHEMA,
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

    await supertest(httpServer)
      .post(`/`); // but not passed by the client

    expect(headerExists).toBeFalsy();
  });

  it('should return 400 if validateSchemaString return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaString, 'validateSchemaString')
      .mockImplementation(() => errors);

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: () => undefined,
        metadata: {
          contract: {
            request: {
              headers: {
                [HEADER_NAME]: HEADER_SCHEMA,
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
      .set(HEADER_NAME, HEADER_VALUE);

    expect(response.body).toEqual(errors);
    expect(response.statusCode).toEqual(400);
  });
});
