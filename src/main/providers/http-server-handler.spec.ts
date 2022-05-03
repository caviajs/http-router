import { Readable, Stream } from 'stream';
import { HttpServerRegistry } from './http-server-registry';
import { HttpServerHandler } from './http-server-handler';
import { Logger } from './logger';
import { LoggerLevel } from './logger-level';
import { Injector } from '../injector';
import { Endpoint, EndpointMetadata } from '../types/endpoint';
import { Injectable } from '../decorators/injectable';
import { Interceptor, Next } from '../types/interceptor';
import { Observable } from 'rxjs';
import { Request } from '../types/request';
import { Response } from '../types/response';
import http from 'http';
import { HttpException } from '../exceptions/http-exception';
import { HttpServerSerializer } from './http-server-serializer';

const EXAMPLE_UNDEFINED: undefined = undefined;
const EXAMPLE_BUFFER: Buffer = Buffer.from('Hello World');
const EXAMPLE_STREAM: Stream = Readable.from('Hello World');
const EXAMPLE_STRING: string = 'Hello World';
const EXAMPLE_TRUE: boolean = true;
const EXAMPLE_FALSE: boolean = false;
const EXAMPLE_NUMBER: number = 1245;
const EXAMPLE_OBJECT: object = { foo: 'bar' };
const EXAMPLE_ARRAY: number[] = [1, 2, 4, 5];

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

  let httpServerRegistry: HttpServerRegistry;
  let httpServerHandler: HttpServerHandlerTest;

  let undefinedEndpoint: UndefinedEndpoint;
  let bufferEndpoint: BufferEndpoint;
  let streamEndpoint: StreamEndpoint;
  let stringEndpoint: StringEndpoint;
  let trueEndpoint: TrueEndpoint;
  let falseEndpoint: FalseEndpoint;
  let numberEndpoint: NumberEndpoint;
  let objectEndpoint: ObjectEndpoint;
  let arrayEndpoint: ArrayEndpoint;
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

    const injector: Injector = await Injector.create([
      UndefinedEndpoint,
      BufferEndpoint,
      StreamEndpoint,
      StringEndpoint,
      TrueEndpoint,
      FalseEndpoint,
      NumberEndpoint,
      ObjectEndpoint,
      ArrayEndpoint,

      FirstInterceptor,
      SecondInterceptor,
    ]);

    httpServerRegistry = new HttpServerRegistry(new Logger(LoggerLevel.OFF, () => ''));
    httpServerHandler = new HttpServerHandlerTest(httpServerRegistry, new HttpServerSerializer(), injector);

    undefinedEndpoint = await injector.find(UndefinedEndpoint);
    bufferEndpoint = await injector.find(BufferEndpoint);
    streamEndpoint = await injector.find(StreamEndpoint);
    stringEndpoint = await injector.find(StringEndpoint);
    trueEndpoint = await injector.find(TrueEndpoint);
    falseEndpoint = await injector.find(FalseEndpoint);
    numberEndpoint = await injector.find(NumberEndpoint);
    objectEndpoint = await injector.find(ObjectEndpoint);
    arrayEndpoint = await injector.find(ArrayEndpoint);
    firstInterceptor = await injector.find(FirstInterceptor);
    secondInterceptor = await injector.find(SecondInterceptor);

    httpServerRegistry.add(undefinedEndpoint);
    httpServerRegistry.add(bufferEndpoint);
    httpServerRegistry.add(streamEndpoint);
    httpServerRegistry.add(stringEndpoint);
    httpServerRegistry.add(trueEndpoint);
    httpServerRegistry.add(falseEndpoint);
    httpServerRegistry.add(numberEndpoint);
    httpServerRegistry.add(objectEndpoint);
    httpServerRegistry.add(arrayEndpoint);
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
      // it('should throw HttpException with 404', async () => {
      //   request.url = '/not-existing-route';
      //
      //   const exception = new HttpException(404, 'Route not found');
      //   const exceptionStatus = exception.getStatus();
      //   const exceptionResponse = exception.getResponse();
      //
      //   await httpServerHandler.handle(request as any, response as any);
      //
      //   expect(request.metadata).toBeUndefined();
      //   expect(request.params).toEqual({});
      //   expect(responseWriteHeadSpy).toHaveBeenNthCalledWith(1, exceptionStatus, {
      //     'Content-Length': Buffer.byteLength(JSON.stringify(exceptionResponse)),
      //     'Content-Type': 'application/json; charset=utf-8',
      //   });
      //   expect(responseEndSpy).toHaveBeenNthCalledWith(1, JSON.stringify(exceptionResponse));
      // });

      // not existing route - Error handling (should throw HttpException(500))
      // not existing route - HttpException handling (should throw HttpException(500))
      // not existing route - interceptors (global req interceptors -> {throw HttpException(404)} -> global res interceptors)
    });

    describe('existing route', () => {
      // existing route - HttpException handling (should throw HttpException(500))
      // existing route - Error handling (should throw HttpException(500))
      // existing route - handling
      // existing route - handling + params parsing
      // existing route - handling + serializing, Content-Type and Content-Length inference for response body

      describe('should correctly serialize and inference headers', () => {
        it('should correctly serialize undefined', async () => {
          request.url = '/undefined';

          expect(request.metadata).toBeUndefined();
          expect(request.params).toBeUndefined();
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(request.metadata).toEqual(undefinedEndpoint.metadata);
          expect(request.params).toEqual({});
          expect(response.end).toHaveBeenNthCalledWith(1);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 204); // Inferred status code (204 No Content)
        });

        it('should correctly serialize undefined with predefined response properties', async () => {
          request.url = '/undefined';
          response.statusCode = 402;

          expect(request.metadata).toBeUndefined();
          expect(request.params).toBeUndefined();
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(request.metadata).toEqual(undefinedEndpoint.metadata);
          expect(request.params).toEqual({});
          expect(response.end).toHaveBeenNthCalledWith(1);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 402); // Overwritten status code
        });

        it('should correctly serialize Buffer', async () => {
          request.url = '/buffer';

          expect(request.metadata).toBeUndefined();
          expect(request.params).toBeUndefined();
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(request.metadata).toEqual(bufferEndpoint.metadata);
          expect(request.params).toEqual({});
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

          expect(request.metadata).toBeUndefined();
          expect(request.params).toBeUndefined();
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(request.metadata).toEqual(bufferEndpoint.metadata);
          expect(request.params).toEqual({});
          expect(response.end).toHaveBeenNthCalledWith(1, EXAMPLE_BUFFER);
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
            'Content-Length': 'Popcorn', // Overwritten Content-Length
            'Content-Type': 'Popcorn', // Overwritten Content-Type
          });
        });

        it('should correctly serialize Stream', async () => {
          jest.spyOn(EXAMPLE_STREAM, 'pipe').mockImplementation(jest.fn());

          request.url = '/stream';

          expect(request.metadata).toBeUndefined();
          expect(request.params).toBeUndefined();
          expect(EXAMPLE_STREAM.pipe).not.toHaveBeenCalled();
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(request.metadata).toEqual(streamEndpoint.metadata);
          expect(request.params).toEqual({});
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

          expect(request.metadata).toBeUndefined();
          expect(request.params).toBeUndefined();
          expect(EXAMPLE_STREAM.pipe).not.toHaveBeenCalled();
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).not.toHaveBeenCalled();

          await httpServerHandler.handle(request as any, response as any);

          expect(request.metadata).toEqual(streamEndpoint.metadata);
          expect(request.params).toEqual({});
          expect(EXAMPLE_STREAM.pipe).toHaveBeenNthCalledWith(1, response);
          expect(response.end).not.toHaveBeenCalled();
          expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
            'Content-Type': 'Popcorn', // Overwritten Content-Type
          });
        });

        it('should correctly serialize String', async () => {
        });
        it('should correctly serialize String with predefined response properties', async () => {
        });
        it('should correctly serialize JSON', async () => {
        });
        it('should correctly serialize JSON with predefined response properties', async () => {
        });
      });

      // existing route - handling + interceptors (global req interceptors -> handler -> global res interceptors)
    });
  });
});
