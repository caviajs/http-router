import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaStream, ValidationError, HttpRouter } from '../../../src';
import * as schemaStream from '../../../src/contract/schema-stream';
import { Readable } from 'stream';

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
const SCHEMA: SchemaStream = { type: 'stream' };

describe('SchemaStream', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to stream and then call validateSchemaStream', async () => {
    const validateSchemaStreamSpy = jest.spyOn(schemaStream, 'validateSchemaStream');

    for (const CONTENT_TYPE of CONTENT_TYPES) {
      let body: Readable;
      let bodyBuffer: Buffer = Buffer.alloc(0);

      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept(HttpContract.setup())
        .route({
          handler: async (request) => {
            body = request.body;

            await new Promise<void>(resolve => {
              request.body.on('data', (chunk: Buffer) => bodyBuffer = Buffer.concat([bodyBuffer, chunk]));
              request.body.on('end', () => resolve());
            });
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

      expect(body instanceof Readable).toEqual(true);
      expect(bodyBuffer.toString()).toEqual(DATA);

      expect(validateSchemaStreamSpy).toHaveBeenNthCalledWith(1, SCHEMA, expect.any(http.IncomingMessage), PATH);

      jest.clearAllMocks();
    }
  });

  it('should return 400 if validateSchemaStream return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaStream, 'validateSchemaStream')
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
