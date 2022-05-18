import http from 'http';
import supertest from 'supertest';
import { Readable, Stream } from 'stream';
import { HttpRouter } from '../src';
import { of } from 'rxjs';

const EXAMPLE_UNDEFINED: undefined = undefined;
const EXAMPLE_BUFFER: Buffer = Buffer.from('Hello World');
const EXAMPLE_STREAM_DATA: string = 'Hello World';
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
    // undefined
    .route({ handler: () => EXAMPLE_UNDEFINED, method: 'GET', path: '/undefined-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_UNDEFINED), method: 'GET', path: '/undefined-async' })
    .route({ handler: () => of(EXAMPLE_UNDEFINED), method: 'GET', path: '/undefined-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_UNDEFINED)), method: 'GET', path: '/undefined-observable-async' })

    // buffer
    .route({ handler: () => EXAMPLE_BUFFER, method: 'GET', path: '/buffer-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_BUFFER), method: 'GET', path: '/buffer-async' })
    .route({ handler: () => of(EXAMPLE_BUFFER), method: 'GET', path: '/buffer-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_BUFFER)), method: 'GET', path: '/buffer-observable-async' })

    // stream
    .route({ handler: () => Readable.from(EXAMPLE_STREAM_DATA), method: 'GET', path: '/stream-sync' })
    .route({ handler: () => Promise.resolve(Readable.from(EXAMPLE_STREAM_DATA)), method: 'GET', path: '/stream-async' })
    .route({ handler: () => of(Readable.from(EXAMPLE_STREAM_DATA)), method: 'GET', path: '/stream-observable-sync' })
    .route({ handler: () => Promise.resolve(of(Readable.from(EXAMPLE_STREAM_DATA))), method: 'GET', path: '/stream-observable-async' })

    // string
    .route({ handler: () => EXAMPLE_STRING, method: 'GET', path: '/string-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_STRING), method: 'GET', path: '/string-async' })
    .route({ handler: () => of(EXAMPLE_STRING), method: 'GET', path: '/string-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_STRING)), method: 'GET', path: '/string-observable-async' })

    // true
    .route({ handler: () => EXAMPLE_TRUE, method: 'GET', path: '/true-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_TRUE), method: 'GET', path: '/true-async' })
    .route({ handler: () => of(EXAMPLE_TRUE), method: 'GET', path: '/true-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_TRUE)), method: 'GET', path: '/true-observable-async' })

    // false
    .route({ handler: () => EXAMPLE_FALSE, method: 'GET', path: '/false-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_FALSE), method: 'GET', path: '/false-async' })
    .route({ handler: () => of(EXAMPLE_FALSE), method: 'GET', path: '/false-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_FALSE)), method: 'GET', path: '/false-observable-async' })

    // number
    .route({ handler: () => EXAMPLE_NUMBER, method: 'GET', path: '/number-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_NUMBER), method: 'GET', path: '/number-async' })
    .route({ handler: () => of(EXAMPLE_NUMBER), method: 'GET', path: '/number-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_NUMBER)), method: 'GET', path: '/number-observable-async' })

    // null
    .route({ handler: () => EXAMPLE_NULL, method: 'GET', path: '/null-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_NULL), method: 'GET', path: '/null-async' })
    .route({ handler: () => of(EXAMPLE_NULL), method: 'GET', path: '/null-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_NULL)), method: 'GET', path: '/null-observable-async' })

    // array
    .route({ handler: () => EXAMPLE_ARRAY, method: 'GET', path: '/array-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_ARRAY), method: 'GET', path: '/array-async' })
    .route({ handler: () => of(EXAMPLE_ARRAY), method: 'GET', path: '/array-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_ARRAY)), method: 'GET', path: '/array-observable-async' })

    // object
    .route({ handler: () => EXAMPLE_OBJECT, method: 'GET', path: '/object-sync' })
    .route({ handler: () => Promise.resolve(EXAMPLE_OBJECT), method: 'GET', path: '/object-async' })
    .route({ handler: () => of(EXAMPLE_OBJECT), method: 'GET', path: '/object-observable-sync' })
    .route({ handler: () => Promise.resolve(of(EXAMPLE_OBJECT)), method: 'GET', path: '/object-observable-async' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  it('should correctly serialize undefined', async () => {
    {
      const response = await supertest(httpServer)
        .get('/undefined-sync');

      expect(response.type).toBe('');
      expect(response.headers['content-length']).toBe('0');
      expect(response.headers['content-type']).toBeUndefined();
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/undefined-async');

      expect(response.type).toBe('');
      expect(response.headers['content-length']).toBe('0');
      expect(response.headers['content-type']).toBeUndefined();
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/undefined-observable-sync');

      expect(response.type).toBe('');
      expect(response.headers['content-length']).toBe('0');
      expect(response.headers['content-type']).toBeUndefined();
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/undefined-observable-async');

      expect(response.type).toBe('');
      expect(response.headers['content-length']).toBe('0');
      expect(response.headers['content-type']).toBeUndefined();
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize buffer', async () => {
    {
      const response = await supertest(httpServer)
        .get('/buffer-sync');

      expect(response.body).toEqual(EXAMPLE_BUFFER);
      expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
      expect(response.headers['content-type']).toBe('application/octet-stream');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/buffer-async');

      expect(response.body).toEqual(EXAMPLE_BUFFER);
      expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
      expect(response.headers['content-type']).toBe('application/octet-stream');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/buffer-observable-sync');

      expect(response.body).toEqual(EXAMPLE_BUFFER);
      expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
      expect(response.headers['content-type']).toBe('application/octet-stream');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/buffer-observable-async');

      expect(response.body).toEqual(EXAMPLE_BUFFER);
      expect(response.headers['content-length']).toBe(EXAMPLE_BUFFER.length.toString());
      expect(response.headers['content-type']).toBe('application/octet-stream');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize stream', async () => {
    {
      const response = await supertest(httpServer)
        .get('/stream-sync');

      expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
      expect(response.headers['content-length']).toBeUndefined();
      expect(response.headers['content-type']).toBe('application/octet-stream');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/stream-async');

      expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
      expect(response.headers['content-length']).toBeUndefined();
      expect(response.headers['content-type']).toBe('application/octet-stream');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/stream-observable-sync');

      expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
      expect(response.headers['content-length']).toBeUndefined();
      expect(response.headers['content-type']).toBe('application/octet-stream');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/stream-observable-async');

      expect(response.body.toString()).toEqual(EXAMPLE_STREAM_DATA);
      expect(response.headers['content-length']).toBeUndefined();
      expect(response.headers['content-type']).toBe('application/octet-stream');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize string', async () => {
    {
      const response = await supertest(httpServer)
        .get('/string-sync');

      expect(response.text).toBe(EXAMPLE_STRING);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
      expect(response.headers['content-type']).toBe('text/plain');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/string-async');

      expect(response.text).toBe(EXAMPLE_STRING);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
      expect(response.headers['content-type']).toBe('text/plain');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/string-observable-sync');

      expect(response.text).toBe(EXAMPLE_STRING);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
      expect(response.headers['content-type']).toBe('text/plain');
      expect(response.statusCode).toBe(200);
    }

    {
      const response = await supertest(httpServer)
        .get('/string-observable-async');

      expect(response.text).toBe(EXAMPLE_STRING);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(EXAMPLE_STRING).toString());
      expect(response.headers['content-type']).toBe('text/plain');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize boolean (true)', async () => {
    {
      const raw: string = JSON.stringify(EXAMPLE_TRUE);

      const response = await supertest(httpServer)
        .get('/true-sync');

      expect(response.body).toEqual(EXAMPLE_TRUE);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_TRUE);

      const response = await supertest(httpServer)
        .get('/true-async');

      expect(response.body).toEqual(EXAMPLE_TRUE);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_TRUE);

      const response = await supertest(httpServer)
        .get('/true-observable-sync');

      expect(response.body).toEqual(EXAMPLE_TRUE);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_TRUE);

      const response = await supertest(httpServer)
        .get('/true-observable-async');

      expect(response.body).toEqual(EXAMPLE_TRUE);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize boolean (false)', async () => {
    {
      const raw: string = JSON.stringify(EXAMPLE_FALSE);

      const response = await supertest(httpServer)
        .get('/false-sync');

      expect(response.body).toEqual(EXAMPLE_FALSE);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_FALSE);

      const response = await supertest(httpServer)
        .get('/false-async');

      expect(response.body).toEqual(EXAMPLE_FALSE);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_FALSE);

      const response = await supertest(httpServer)
        .get('/false-observable-sync');

      expect(response.body).toEqual(EXAMPLE_FALSE);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_FALSE);

      const response = await supertest(httpServer)
        .get('/false-observable-async');

      expect(response.body).toEqual(EXAMPLE_FALSE);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize number', async () => {
    {
      const raw: string = JSON.stringify(EXAMPLE_NUMBER);

      const response = await supertest(httpServer)
        .get('/number-sync');

      expect(response.body).toEqual(EXAMPLE_NUMBER);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_NUMBER);

      const response = await supertest(httpServer)
        .get('/number-async');

      expect(response.body).toEqual(EXAMPLE_NUMBER);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_NUMBER);

      const response = await supertest(httpServer)
        .get('/number-observable-sync');

      expect(response.body).toEqual(EXAMPLE_NUMBER);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_NUMBER);

      const response = await supertest(httpServer)
        .get('/number-observable-async');

      expect(response.body).toEqual(EXAMPLE_NUMBER);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize null', async () => {
    {
      const raw: string = JSON.stringify(EXAMPLE_NULL);

      const response = await supertest(httpServer)
        .get('/null-sync');

      expect(response.body).toEqual(EXAMPLE_NULL);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_NULL);

      const response = await supertest(httpServer)
        .get('/null-async');

      expect(response.body).toEqual(EXAMPLE_NULL);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_NULL);

      const response = await supertest(httpServer)
        .get('/null-observable-sync');

      expect(response.body).toEqual(EXAMPLE_NULL);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_NULL);

      const response = await supertest(httpServer)
        .get('/null-observable-async');

      expect(response.body).toEqual(EXAMPLE_NULL);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize array', async () => {
    {
      const raw: string = JSON.stringify(EXAMPLE_ARRAY);

      const response = await supertest(httpServer)
        .get('/array-sync');

      expect(response.body).toEqual(EXAMPLE_ARRAY);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_ARRAY);

      const response = await supertest(httpServer)
        .get('/array-async');

      expect(response.body).toEqual(EXAMPLE_ARRAY);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_ARRAY);

      const response = await supertest(httpServer)
        .get('/array-observable-sync');

      expect(response.body).toEqual(EXAMPLE_ARRAY);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_ARRAY);

      const response = await supertest(httpServer)
        .get('/array-observable-async');

      expect(response.body).toEqual(EXAMPLE_ARRAY);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }
  });

  it('should correctly serialize object', async () => {
    {
      const raw: string = JSON.stringify(EXAMPLE_OBJECT);

      const response = await supertest(httpServer)
        .get('/object-sync');

      expect(response.body).toEqual(EXAMPLE_OBJECT);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_OBJECT);

      const response = await supertest(httpServer)
        .get('/object-async');

      expect(response.body).toEqual(EXAMPLE_OBJECT);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_OBJECT);

      const response = await supertest(httpServer)
        .get('/object-observable-sync');

      expect(response.body).toEqual(EXAMPLE_OBJECT);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }

    {
      const raw: string = JSON.stringify(EXAMPLE_OBJECT);

      const response = await supertest(httpServer)
        .get('/object-observable-sync');

      expect(response.body).toEqual(EXAMPLE_OBJECT);
      expect(response.headers['content-length']).toBe(Buffer.byteLength(raw).toString());
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.statusCode).toBe(200);
    }
  });
});
