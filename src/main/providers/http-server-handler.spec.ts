import { Readable, Stream } from 'stream';
import { HttpServerRouter } from './http-server-router';
import { HttpServerHandler } from './http-server-handler';
import { Logger } from './logger';
import { LoggerLevel } from './logger-level';
import { Container } from '../container';
import { Endpoint, EndpointMetadata } from '../types/endpoint';
import { Injectable } from '../decorators/injectable';
import { Interceptor, Next } from '../types/interceptor';
import { Observable } from 'rxjs';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { HttpException } from '../exceptions/http-exception';

const EXAMPLE_UNDEFINED: undefined = undefined;
const EXAMPLE_BUFFER: Buffer = Buffer.from('Hello World');
const EXAMPLE_STREAM: Stream = Readable.from('Hello World');
const EXAMPLE_STRING: string = 'Hello World';
const EXAMPLE_TRUE: boolean = true;
const EXAMPLE_FALSE: boolean = false;
const EXAMPLE_NUMBER: number = 1245;
const EXAMPLE_NULL: null = null;
const EXAMPLE_ARRAY: number[] = [1, 2, 4, 5];
const EXAMPLE_OBJECT: object = { foo: 'bar' };

const EXAMPLE_HTTP_EXCEPTION: HttpException = new HttpException(418);
const EXAMPLE_ERROR: Error = new Error('Hello World');

@Injectable()
class UndefinedEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/undefined',
  };

  handle(): undefined {
    return EXAMPLE_UNDEFINED;
  }
}

@Injectable()
class BufferEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/buffer',
  };

  handle(): Buffer {
    return EXAMPLE_BUFFER;
  }
}

@Injectable()
class StreamEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/stream',
  };

  handle(): Stream {
    return EXAMPLE_STREAM;
  }
}

@Injectable()
class StringEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/string',
  };

  handle(): string {
    return EXAMPLE_STRING;
  }
}

@Injectable()
class TrueEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/true',
  };

  handle(): boolean {
    return EXAMPLE_TRUE;
  }
}

@Injectable()
class FalseEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/false',
  };

  handle(): boolean {
    return EXAMPLE_FALSE;
  }
}

@Injectable()
class NumberEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/number',
  };

  handle(): number {
    return EXAMPLE_NUMBER;
  }
}

@Injectable()
class NullEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/null',
  };

  handle(): number {
    return EXAMPLE_NULL;
  }
}

@Injectable()
class ArrayEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/array',
  };

  handle(): number[] {
    return EXAMPLE_ARRAY;
  }
}

@Injectable()
class ObjectEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/object',
  };

  handle(): object {
    return EXAMPLE_OBJECT;
  }
}

@Injectable()
class HttpExceptionEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/http-exception',
  };

  handle(): never {
    throw EXAMPLE_HTTP_EXCEPTION;
  }
}

@Injectable()
class ErrorEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/error',
  };

  handle(): never {
    throw EXAMPLE_ERROR;
  }
}

@Injectable()
class FirstInterceptor extends Interceptor {
  intercept(request, response, next: Next): Observable<any> {
    return next.handle();
  }
}

@Injectable()
class SecondInterceptor extends Interceptor {
  intercept(request, response, next: Next): Observable<any> {
    return next.handle();
  }
}

class HttpServerHandlerTest extends HttpServerHandler {
  public getInterceptors(): Interceptor[] {
    return this.interceptors;
  }
}

describe('HttpServerHandler', () => {
  let responseEndSpy: jest.SpyInstance;
  let responseWriteHeadSpy: jest.SpyInstance;
  let request: Partial<Request>;
  let response: Partial<Response>;

  let httpServerRegistry: HttpServerRouter;
  let httpServerHandler: HttpServerHandlerTest;

  let undefinedEndpoint: UndefinedEndpoint;
  let bufferEndpoint: BufferEndpoint;
  let streamEndpoint: StreamEndpoint;
  let stringEndpoint: StringEndpoint;
  let trueEndpoint: TrueEndpoint;
  let falseEndpoint: FalseEndpoint;
  let numberEndpoint: NumberEndpoint;
  let nullEndpoint: NullEndpoint;
  let arrayEndpoint: ArrayEndpoint;
  let objectEndpoint: ObjectEndpoint;
  let httpExceptionEndpoint: HttpExceptionEndpoint;
  let errorEndpoint: ErrorEndpoint;

  let firstInterceptor: FirstInterceptor;
  let secondInterceptor: SecondInterceptor;

  beforeEach(async () => {
    responseEndSpy = jest.fn();
    responseWriteHeadSpy = jest.fn().mockImplementation(function () {
      return this;
    });
    request = {
      method: 'GET',
      url: '/',
    };
    response = {
      getHeader: jest.fn(),
      writableEnded: false,
      writeHead: responseWriteHeadSpy as any,
      end: responseEndSpy as any,
    };

    const container: Container = await Container.create([
      UndefinedEndpoint,
      BufferEndpoint,
      StreamEndpoint,
      StringEndpoint,
      TrueEndpoint,
      FalseEndpoint,
      NumberEndpoint,
      NullEndpoint,
      ArrayEndpoint,
      ObjectEndpoint,
      HttpExceptionEndpoint,
      ErrorEndpoint,

      FirstInterceptor,
      SecondInterceptor,
    ]);

    httpServerRegistry = new HttpServerRouter(new Logger(LoggerLevel.OFF, () => ''));
    httpServerHandler = new HttpServerHandlerTest(container, httpServerRegistry);

    undefinedEndpoint = await container.find(UndefinedEndpoint);
    bufferEndpoint = await container.find(BufferEndpoint);
    streamEndpoint = await container.find(StreamEndpoint);
    stringEndpoint = await container.find(StringEndpoint);
    trueEndpoint = await container.find(TrueEndpoint);
    falseEndpoint = await container.find(FalseEndpoint);
    numberEndpoint = await container.find(NumberEndpoint);
    nullEndpoint = await container.find(NullEndpoint);
    arrayEndpoint = await container.find(ArrayEndpoint);
    objectEndpoint = await container.find(ObjectEndpoint);
    httpExceptionEndpoint = await container.find(HttpExceptionEndpoint);
    errorEndpoint = await container.find(ErrorEndpoint);

    firstInterceptor = await container.find(FirstInterceptor);
    secondInterceptor = await container.find(SecondInterceptor);

    httpServerRegistry.declareEndpoint(undefinedEndpoint);
    httpServerRegistry.declareEndpoint(bufferEndpoint);
    httpServerRegistry.declareEndpoint(streamEndpoint);
    httpServerRegistry.declareEndpoint(stringEndpoint);
    httpServerRegistry.declareEndpoint(trueEndpoint);
    httpServerRegistry.declareEndpoint(falseEndpoint);
    httpServerRegistry.declareEndpoint(numberEndpoint);
    httpServerRegistry.declareEndpoint(nullEndpoint);
    httpServerRegistry.declareEndpoint(arrayEndpoint);
    httpServerRegistry.declareEndpoint(objectEndpoint);
    httpServerRegistry.declareEndpoint(httpExceptionEndpoint);
    httpServerRegistry.declareEndpoint(errorEndpoint);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should add interceptors', async () => {
      expect(httpServerHandler.getInterceptors()).toEqual([]);

      await httpServerHandler.onApplicationBoot();

      expect(httpServerHandler.getInterceptors()).toEqual([
        firstInterceptor,
        secondInterceptor,
      ]);
    });
  });

  describe('handle', () => {
    describe('not existing route', () => {
      // not existing route - should throw HttpException(404)
      it('should throw HttpException with 404', async () => {
        const exception = new HttpException(404, 'Route not found');

        request.url = '/not-existing-endpoint';

        expect(response.end).not.toHaveBeenCalled();
        expect(response.writeHead).not.toHaveBeenCalled();

        await httpServerHandler.handle(request as any, response as any);

        const exceptionStatus = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        expect(response.end).toHaveBeenNthCalledWith(1, JSON.stringify(exceptionResponse));
        expect(response.writeHead).toHaveBeenNthCalledWith(1, exceptionStatus, { // Inferred status code (200 OK)
          'Content-Length': Buffer.byteLength(JSON.stringify(exceptionResponse)), // Inferred Content-Length
          'Content-Type': 'application/json; charset=utf-8', // Inferred Content-Type
        });
      });

      // not existing route - interceptors (global req interceptors -> {throw HttpException(404)} -> global res interceptors)
      // not existing route - interceptors + HttpException handling (should throw HttpException)
      // not existing route - interceptors + Error handling (should throw HttpException(500))
    });

    describe('existing route', () => {
      // existing route - handling correctly routes (methods/urls)
      // existing route - handling + metadata
      // existing route - handling + params parsing
      // existing route - handling + interceptors sequence (global req interceptors -> handler -> global res interceptors)
      // existing route - handling + interceptors + HttpException handling (should throw HttpException)
      // existing route - handling + interceptors + Error handling (should throw HttpException(500))

      describe('should handle errors correctly', () => {
        // existing route - HttpException handling (should throw HttpException(500))
        it('should correctly handling HttpException', async () => {
          request.url = '/http-exception';

          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          const exceptionStatus = EXAMPLE_HTTP_EXCEPTION.getStatus();
          const exceptionResponse = EXAMPLE_HTTP_EXCEPTION.getResponse();

          expect(response.end).toHaveBeenNthCalledWith(1, JSON.stringify(exceptionResponse));
          expect(response.writeHead).toHaveBeenNthCalledWith(1, exceptionStatus, { // Inferred status code (200 OK)
            'Content-Length': Buffer.byteLength(JSON.stringify(exceptionResponse)), // Inferred Content-Length
            'Content-Type': 'application/json; charset=utf-8', // Inferred Content-Type
          });
        });

        // existing route - Error handling (should throw HttpException(500))
        it('should correctly handling Error', async () => {
          const exception = new HttpException(500);

          request.url = '/error';

          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          const exceptionStatus = exception.getStatus();
          const exceptionResponse = exception.getResponse();

          expect(response.end).toHaveBeenNthCalledWith(1, JSON.stringify(exceptionResponse));
          expect(response.writeHead).toHaveBeenNthCalledWith(1, exceptionStatus, { // Inferred status code (200 OK)
            'Content-Length': Buffer.byteLength(JSON.stringify(exceptionResponse)), // Inferred Content-Length
            'Content-Type': 'application/json; charset=utf-8', // Inferred Content-Type
          });
        });
      });

      // existing route - handling response body - serializing, Content-Type and Content-Length inference
      describe('should correctly serialize and inference headers', () => {
        it('should correctly serialize undefined', async () => {
          request.url = '/undefined';

          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(response.end).toHaveBeenNthCalledWith(1);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 204); // Inferred status code (204 No Content)
        });

        it('should correctly serialize undefined with predefined response properties', async () => {
          request.url = '/undefined';
          response.statusCode = 402;

          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(response.end).toHaveBeenNthCalledWith(1);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 402); // Overwritten status code
        });

        it('should correctly serialize Buffer', async () => {
          request.url = '/buffer';

          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(response.end).toHaveBeenNthCalledWith(1, EXAMPLE_BUFFER);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 200, { // Inferred status code (200 OK)
            'Content-Length': EXAMPLE_BUFFER.length, // Inferred Content-Length
            'Content-Type': 'application/octet-stream', // Inferred Content-Type
          });
        });

        it('should correctly serialize Buffer with predefined response properties', async () => {
          jest.spyOn(response, 'getHeader').mockImplementation(() => 'Popcorn');

          request.url = '/buffer';
          response.statusCode = 402;

          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(response.end).toHaveBeenNthCalledWith(1, EXAMPLE_BUFFER);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
            'Content-Length': 'Popcorn', // Overwritten Content-Length
            'Content-Type': 'Popcorn', // Overwritten Content-Type
          });
        });

        it('should correctly serialize Stream', async () => {
          jest.spyOn(EXAMPLE_STREAM, 'pipe').mockImplementation(jest.fn());

          request.url = '/stream';

          expect(EXAMPLE_STREAM.pipe).not.toHaveBeenCalled();
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(EXAMPLE_STREAM.pipe).toHaveBeenNthCalledWith(1, response);
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 200, { // Inferred status code (200 OK)
            'Content-Type': 'application/octet-stream', // Inferred Content-Type
          });
        });

        it('should correctly serialize Stream with predefined response properties', async () => {
          jest.spyOn(EXAMPLE_STREAM, 'pipe').mockImplementation(jest.fn());
          jest.spyOn(response, 'getHeader').mockImplementation(() => 'Popcorn');

          request.url = '/stream';
          response.statusCode = 402;

          expect(EXAMPLE_STREAM.pipe).not.toHaveBeenCalled();
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(EXAMPLE_STREAM.pipe).toHaveBeenNthCalledWith(1, response);
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
            'Content-Type': 'Popcorn', // Overwritten Content-Type
          });
        });

        it('should correctly serialize String', async () => {
          request.url = '/string';

          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(response.end).toHaveBeenNthCalledWith(1, EXAMPLE_STRING);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 200, { // Inferred status code (200 OK)
            'Content-Length': Buffer.byteLength(EXAMPLE_STRING), // Inferred Content-Length
            'Content-Type': 'text/plain', // Inferred Content-Type
          });
        });

        it('should correctly serialize String with predefined response properties', async () => {
          jest.spyOn(response, 'getHeader').mockImplementation(() => 'Popcorn');

          request.url = '/string';
          response.statusCode = 402;

          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(response.end).toHaveBeenNthCalledWith(1, EXAMPLE_STRING);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
            'Content-Length': 'Popcorn', // Overwritten Content-Length
            'Content-Type': 'Popcorn', // Overwritten Content-Type
          });
        });

        it('should correctly serialize JSON', async () => {
          // JSON (true, false, number, null, array, object) but without string
          const examples = new Map()
            .set('/true', EXAMPLE_TRUE)
            .set('/false', EXAMPLE_FALSE)
            .set('/number', EXAMPLE_NUMBER)
            .set('/null', EXAMPLE_NULL)
            .set('/array', EXAMPLE_ARRAY)
            .set('/object', EXAMPLE_OBJECT);

          for (const [url, data] of [...examples.entries()]) {
            request.url = url;

            expect(response.end).not.toHaveBeenCalled();
            expect(response.writeHead).not.toHaveBeenCalled();

            await httpServerHandler.handle(request as any, response as any);

            expect(response.end).toHaveBeenNthCalledWith(1, JSON.stringify(data));
            expect(response.writeHead).toHaveBeenNthCalledWith(1, 200, { // Inferred status code (200 OK)
              'Content-Length': Buffer.byteLength(JSON.stringify(data)), // Inferred Content-Length
              'Content-Type': 'application/json; charset=utf-8', // Inferred Content-Type
            });

            jest.clearAllMocks();
          }
        });

        it('should correctly serialize JSON with predefined response properties', async () => {
          // JSON (true, false, number, null, array, object) but without string
          const examples = new Map()
            .set('/true', EXAMPLE_TRUE)
            .set('/false', EXAMPLE_FALSE)
            .set('/number', EXAMPLE_NUMBER)
            .set('/null', EXAMPLE_NULL)
            .set('/array', EXAMPLE_ARRAY)
            .set('/object', EXAMPLE_OBJECT);

          for (const [url, data] of [...examples.entries()]) {
            jest.spyOn(response, 'getHeader').mockImplementation(() => 'Popcorn');

            request.url = url;
            response.statusCode = 402;

            expect(response.end).not.toHaveBeenCalled();
            expect(response.writeHead).not.toHaveBeenCalled();

            await httpServerHandler.handle(request as any, response as any);

            expect(response.end).toHaveBeenNthCalledWith(1, JSON.stringify(data));
            expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
              'Content-Length': 'Popcorn', // Overwritten Content-Length
              'Content-Type': 'Popcorn', // Overwritten Content-Type
            });

            jest.clearAllMocks();
          }
        });
      });
    });
  });
});
