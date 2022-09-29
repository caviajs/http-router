import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaNumber, ValidationError, HttpRouter } from '../../../src';
import * as schemaNumber from '../../../src/contract/schema-number';

const CONTENT_TYPES: string[] = [
  'application/json',
];

const DATA_AS_STRING: string = '1245';
const DATA_AS_NUMBER: number = Number(DATA_AS_STRING);
const PATH: string[] = ['request', 'body'];
const SCHEMA: SchemaNumber = { type: 'number' };

describe('SchemaNumber', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to number and then call validateSchemaNumber', async () => {
    const validateSchemaNumberSpy = jest.spyOn(schemaNumber, 'validateSchemaNumber');

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

      expect(typeof body).toEqual('number');
      expect(body).toEqual(DATA_AS_NUMBER);

      expect(validateSchemaNumberSpy).toHaveBeenNthCalledWith(1, SCHEMA, DATA_AS_NUMBER, PATH);

      jest.clearAllMocks();
    }
  });

  it('should return 400 if validateSchemaNumber return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaNumber, 'validateSchemaNumber')
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
