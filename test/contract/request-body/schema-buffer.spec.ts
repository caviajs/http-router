import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaBuffer, ValidationError, HttpRouter } from '../../../src';
import * as schemaBuffer from '../../../src/contract/schema-buffer';

const CONTENT_TYPES: string[] = [
  'application/json',
  'application/octet-stream',
  'application/pdf',
  'application/x-www-form-urlencoded',
  'application/xml',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'multipart/form-data',
  'text/css',
  'text/csv',
  'text/html',
  'text/plain',
  'video/mp4',
];

const DATA: string = 'Hello World';
const PATH: string[] = ['request', 'body'];
const SCHEMA: SchemaBuffer = { type: 'buffer' };

describe('SchemaBuffer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to buffer and then call validateSchemaBuffer', async () => {
    const validateSchemaBufferSpy = jest.spyOn(schemaBuffer, 'validateSchemaBuffer');

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

      expect(Buffer.isBuffer(body)).toEqual(true);
      expect(body.toString()).toEqual(DATA);

      expect(validateSchemaBufferSpy).toHaveBeenNthCalledWith(1, SCHEMA, Buffer.from(DATA), PATH);

      jest.clearAllMocks();
    }
  });

  it('should return 400 if validateSchemaBuffer return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaBuffer, 'validateSchemaBuffer')
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
