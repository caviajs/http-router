import http from 'http';
import supertest from 'supertest';
import { Readable, Stream } from 'stream';
import { HttpRouter } from '../src';

const EXAMPLE_UNDEFINED: undefined = undefined;
const EXAMPLE_BUFFER: Buffer = Buffer.from('Hello World');
const EXAMPLE_STREAM_DATA: string = 'Hello World';
const EXAMPLE_STREAM: Stream = Readable.from(EXAMPLE_STREAM_DATA);
const EXAMPLE_STRING: string = 'Hello World';
const EXAMPLE_TRUE: boolean = true;
const EXAMPLE_FALSE: boolean = false;
const EXAMPLE_NUMBER: number = 1245;
const EXAMPLE_NULL: null = null;
const EXAMPLE_ARRAY: number[] = [1, 2, 4, 5];
const EXAMPLE_OBJECT: object = { foo: 'bar' };

describe('Response body serializing', () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({
      handler: (request, response) => {
        return EXAMPLE_UNDEFINED;
      },
      method: 'GET',
      path: '/undefined',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_BUFFER;
      },
      method: 'GET',
      path: '/buffer',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_STREAM;
      },
      method: 'GET',
      path: '/stream',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_STRING;
      },
      method: 'GET',
      path: '/string',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_TRUE;
      },
      method: 'GET',
      path: '/true',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_FALSE;
      },
      method: 'GET',
      path: '/false',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_NUMBER;
      },
      method: 'GET',
      path: '/number',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_NULL;
      },
      method: 'GET',
      path: '/null',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_ARRAY;
      },
      method: 'GET',
      path: '/array',
    })
    .route({
      handler: (request, response) => {
        return EXAMPLE_OBJECT;
      },
      method: 'GET',
      path: '/object',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  it('should correctly serialize undefined', async () => {
    const response = await supertest(httpServer)
      .get('/undefined');

    expect(response.type).toBe('');
    expect(response.headers['content-length']).toBe('0');
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize buffer', async () => {
    const response = await supertest(httpServer)
      .get('/buffer');

    expect(response.body).toEqual(EXAMPLE_BUFFER);
    expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize stream', async () => {
    const response = await supertest(httpServer)
      .get('/stream');

    expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
    expect(response.headers['content-length']).toBeUndefined();
    expect(response.headers['content-type']).toBe('application/octet-stream');
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize string', async () => {
    const response = await supertest(httpServer)
      .get('/string');

    expect(response.text).toBe(EXAMPLE_STRING);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
    expect(response.headers['content-type']).toBe('text/plain');
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize boolean (true)', async () => {
    const raw: string = JSON.stringify(EXAMPLE_TRUE);

    const response = await supertest(httpServer)
      .get('/true');

    expect(response.body).toEqual(EXAMPLE_TRUE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize boolean (false)', async () => {
    const raw: string = JSON.stringify(EXAMPLE_FALSE);

    const response = await supertest(httpServer)
      .get('/false');

    expect(response.body).toEqual(EXAMPLE_FALSE);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize number', async () => {
    const raw: string = JSON.stringify(EXAMPLE_NUMBER);

    const response = await supertest(httpServer)
      .get('/number');

    expect(response.body).toEqual(EXAMPLE_NUMBER);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize null', async () => {
    const raw: string = JSON.stringify(EXAMPLE_NULL);

    const response = await supertest(httpServer)
      .get('/null');

    expect(response.body).toEqual(EXAMPLE_NULL);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize array', async () => {
    const raw: string = JSON.stringify(EXAMPLE_ARRAY);

    const response = await supertest(httpServer)
      .get('/array');

    expect(response.body).toEqual(EXAMPLE_ARRAY);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  });

  it('should correctly serialize object', async () => {
    const raw: string = JSON.stringify(EXAMPLE_OBJECT);

    const response = await supertest(httpServer)
      .get('/object');

    expect(response.body).toEqual(EXAMPLE_OBJECT);
    expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
  });
});
