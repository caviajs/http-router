import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaArray, ValidationError, HttpRouter } from '../../../src';
import * as schemaArray from '../../../src/contract/schema-array';

const CONTENT_TYPES: string[] = [
  'application/json',
];

const DATA_AS_STRING: string = '[1,2,4,5]';
const DATA_AS_ARRAY: number[] = JSON.parse(DATA_AS_STRING);
const PATH: string[] = ['request', 'body'];
const SCHEMA: SchemaArray = { type: 'array' };

describe('SchemaArray', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to array and then call validateSchemaArray', async () => {
    const validateSchemaArraySpy = jest.spyOn(schemaArray, 'validateSchemaArray');

    for (const CONTENT_TYPE of CONTENT_TYPES) {
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

      expect(Array.isArray(body)).toEqual(true);
      expect(body).toEqual(DATA_AS_ARRAY);

      expect(validateSchemaArraySpy).toHaveBeenNthCalledWith(1, SCHEMA, DATA_AS_ARRAY, PATH);

      jest.clearAllMocks();
    }
  });

  it('should return 400 if validateSchemaArray return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaArray, 'validateSchemaArray')
      .mockImplementation(() => errors);

    for (const CONTENT_TYPE of CONTENT_TYPES) {
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
