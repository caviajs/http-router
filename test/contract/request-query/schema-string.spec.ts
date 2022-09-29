import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaString, ValidationError, HttpRouter } from '../../../src';
import * as schemaString from '../../../src/contract/schema-string';

const QUERY_NAME: string = 'id';
const QUERY_VALUE: string = 'hello';
const QUERY_SCHEMA: SchemaString = { type: 'string' };
const PATH: string[] = ['request', 'query', QUERY_NAME];

describe('SchemaString', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to string and then call validateSchemaString', async () => {
    const validateSchemaStringSpy = jest.spyOn(schemaString, 'validateSchemaString');

    let query: any;

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: (request) => {
          query = request.query[QUERY_NAME];
        },
        metadata: {
          contract: {
            request: {
              query: {
                [QUERY_NAME]: QUERY_SCHEMA,
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
      .post(`/`)
      .query({ [QUERY_NAME]: QUERY_VALUE });

    expect(typeof query).toEqual('string');
    expect(query).toEqual(QUERY_VALUE);

    expect(validateSchemaStringSpy).toHaveBeenNthCalledWith(1, QUERY_SCHEMA, QUERY_VALUE, PATH);
  });

  it('query declared in the schema but not passed by the client should not exist in the request.query object', async () => {
    let queryExists: boolean;

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: (request) => {
          queryExists = Object.keys(request.query).includes(QUERY_NAME);
        },
        metadata: {
          contract: {
            request: {
              query: {
                // declared in schema
                [QUERY_NAME]: QUERY_SCHEMA,
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

    expect(queryExists).toBeFalsy();
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
              query: {
                [QUERY_NAME]: QUERY_SCHEMA,
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
      .post(`/`)
      .query({ [QUERY_NAME]: QUERY_VALUE });

    expect(response.body).toEqual(errors);
    expect(response.statusCode).toEqual(400);
  });
});
