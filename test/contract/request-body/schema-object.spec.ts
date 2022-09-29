import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaObject, ValidationError, HttpRouter } from '../../../src';
import * as schemaObject from '../../../src/contract/schema-object';

const DATASET: [string, string, any][] = [
  ['application/json', JSON.stringify({ foo: 'bar' }), { foo: 'bar' }],
  ['application/x-www-form-urlencoded', 'foo=bar&foz=baz', { foo: 'bar', foz: 'baz' }],
];

const PATH: string[] = ['request', 'body'];
const SCHEMA: SchemaObject = { type: 'object' };

describe('SchemaObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to object and then call validateSchemaObject', async () => {
    const validateSchemaObjectSpy = jest.spyOn(schemaObject, 'validateSchemaObject');

    for (const [CONTENT_TYPE, DATA_AS_STRING, DATA_AS_OBJECT] of DATASET) {
      let body: any;

      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept(HttpContract.setup())
        .route({
          handler: (request) => {
            body = request.body;
          },
          metadata: {
            contract: {
              request: {
                body: {
                  [CONTENT_TYPE]: SCHEMA,
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
        .set('Content-Type', CONTENT_TYPE)
        .send(DATA_AS_STRING);

      expect(typeof body).toEqual('object');
      expect(body).toEqual(DATA_AS_OBJECT);

      expect(validateSchemaObjectSpy).toHaveBeenNthCalledWith(1, SCHEMA, DATA_AS_OBJECT, PATH);

      jest.clearAllMocks();
    }
  });

  it('should return 400 if validateSchemaObject return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaObject, 'validateSchemaObject')
      .mockImplementation(() => errors);

    for (const [CONTENT_TYPE, DATA_AS_STRING] of DATASET) {
      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept(HttpContract.setup())
        .route({
          handler: () => undefined,
          metadata: {
            contract: {
              request: {
                body: {
                  [CONTENT_TYPE]: SCHEMA,
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
        .set('Content-Type', CONTENT_TYPE)
        .send(DATA_AS_STRING);

      expect(response.body).toEqual(errors);
      expect(response.statusCode).toEqual(400);

      jest.clearAllMocks();
    }
  });
});
