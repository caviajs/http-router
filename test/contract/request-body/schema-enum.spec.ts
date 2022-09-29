import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaEnum, ValidationError, HttpRouter } from '../../../src';
import * as schemaEnum from '../../../src/contract/schema-enum';

const CONTENT_TYPES: string[] = [];

const DATA: string = 'hello';
const PATH: string[] = ['request', 'body'];
const SCHEMA: SchemaEnum = { enum: ['hello', 'world'], type: 'enum' };

describe('SchemaEnum', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to enum and then call validateSchemaEnum', async () => {
    const validateSchemaEnumSpy = jest.spyOn(schemaEnum, 'validateSchemaEnum');

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
        .send(DATA);

      expect(typeof body).toEqual('string');
      expect(body).toEqual(DATA);

      expect(validateSchemaEnumSpy).toHaveBeenNthCalledWith(1, SCHEMA, DATA, PATH);

      jest.clearAllMocks();
    }
  });

  it('should return 400 if validateSchemaEnum return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaEnum, 'validateSchemaEnum')
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
        .send(DATA);

      expect(response.body).toEqual(errors);
      expect(response.statusCode).toEqual(400);

      jest.clearAllMocks();
    }
  });
});
