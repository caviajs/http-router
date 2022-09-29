import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaBoolean, ValidationError, HttpRouter } from '../../../src';
import * as schemaBoolean from '../../../src/contract/schema-boolean';

const PARAM_NAME: string = 'id';
const PARAM_VALUES: any[] = [
  ['true', true],
  ['false', false],
];
const PARAM_SCHEMA: SchemaBoolean = { type: 'boolean' };
const PATH: string[] = ['request', 'params', PARAM_NAME];

describe('SchemaBoolean', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to boolean and then call validateSchemaBoolean', async () => {
    const validateSchemaBooleanSpy = jest.spyOn(schemaBoolean, 'validateSchemaBoolean');

    for (const [PARAM_VALUE_AS_STRING, PARAM_VALUE_AS_BOOLEAN] of PARAM_VALUES) {
      let param: any;

      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept(HttpContract.setup())
        .route({
          handler: (request) => {
            param = request.params[PARAM_NAME];
          },
          metadata: {
            contract: {
              request: {
                params: {
                  [PARAM_NAME]: PARAM_SCHEMA,
                },
              },
            },
          },
          method: 'POST',
          path: '/:id?',
        });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      await supertest(httpServer)
        .post(`/${ PARAM_VALUE_AS_STRING }`);

      expect(typeof param).toEqual('boolean');
      expect(param).toEqual(PARAM_VALUE_AS_BOOLEAN);

      expect(validateSchemaBooleanSpy).toHaveBeenNthCalledWith(1, PARAM_SCHEMA, PARAM_VALUE_AS_BOOLEAN, PATH);

      jest.clearAllMocks();
    }
  });

  it('param declared in the schema but not passed by the client should not exist in the request.params object', async () => {
    let paramExists: boolean;

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: (request) => {
          paramExists = Object.keys(request.params).includes(PARAM_NAME);
        },
        metadata: {
          contract: {
            request: {
              params: {
                // declared in schema
                [PARAM_NAME]: PARAM_SCHEMA,
              },
            },
          },
        },
        method: 'POST',
        path: '/:id?',
      });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    await supertest(httpServer)
      .post(`/`); // but not passed by the client

    expect(paramExists).toBeFalsy();
  });

  it('should return 400 if validateSchemaBoolean return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaBoolean, 'validateSchemaBoolean')
      .mockImplementation(() => errors);

    for (const [PARAM_VALUE_AS_STRING] of PARAM_VALUES) {
      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept(HttpContract.setup())
        .route({
          handler: () => undefined,
          metadata: {
            contract: {
              request: {
                params: {
                  [PARAM_NAME]: PARAM_SCHEMA,
                },
              },
            },
          },
          method: 'POST',
          path: '/:id?',
        });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      const response = await supertest(httpServer)
        .post(`/${ PARAM_VALUE_AS_STRING }`);

      expect(response.body).toEqual(errors);
      expect(response.statusCode).toEqual(400);

      jest.clearAllMocks();
    }
  });
});
