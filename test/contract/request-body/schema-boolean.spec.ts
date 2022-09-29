import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaBoolean, ValidationError, HttpRouter } from '../../../src';
import * as schemaBoolean from '../../../src/contract/schema-boolean';

const CONTENT_TYPES: string[] = [
  'application/json',
];

const DATASET: any[] = [
  ['true', true],
  ['false', false],
];
const PATH: string[] = ['request', 'body'];
const SCHEMA: SchemaBoolean = { type: 'boolean' };

describe('SchemaBoolean', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to boolean and then call validateSchemaBoolean', async () => {
    const validateSchemaBooleanSpy = jest.spyOn(schemaBoolean, 'validateSchemaBoolean');

    for (const CONTENT_TYPE of CONTENT_TYPES) {
      for (const [DATA_AS_STRING, DATA_AS_BOOLEAN] of DATASET) {
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

        expect(typeof body).toEqual('boolean');
        expect(body).toEqual(DATA_AS_BOOLEAN);

        expect(validateSchemaBooleanSpy).toHaveBeenNthCalledWith(1, SCHEMA, DATA_AS_BOOLEAN, PATH);

        jest.clearAllMocks();
      }
    }
  });

  it('should return 400 if validateSchemaBoolean return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaBoolean, 'validateSchemaBoolean')
      .mockImplementation(() => errors);

    for (const CONTENT_TYPE of CONTENT_TYPES) {
      for (const [DATA_AS_STRING] of DATASET) {
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
    }
  });
});
