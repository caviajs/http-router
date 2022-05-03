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

@Injectable()
class UndefinedEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/undefined',
  };

  handle(): undefined {
    return undefined;
  }
}

@Injectable()
class BufferEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/buffer',
  };

  handle(): Buffer {
    return Buffer.from('Hello World');
  }
}

@Injectable()
class StreamEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/stream',
  };

  handle(): Stream {
    return Readable.from('Hello World');
  }
}

@Injectable()
class StringEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/string',
  };

  handle(): string {
    return 'Hello World';
  }
}

@Injectable()
class TrueEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/true',
  };

  handle(): boolean {
    return true;
  }
}

@Injectable()
class FalseEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/false',
  };

  handle(): boolean {
    return false;
  }
}

@Injectable()
class NumberEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/number',
  };

  handle(): number {
    return 1245;
  }
}

@Injectable()
class ObjectEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/object',
  };

  handle(): object {
    return { foo: 'bar' };
  }
}

@Injectable()
class ArrayEndpoint extends Endpoint {
  readonly metadata: EndpointMetadata = {
    method: 'GET',
    path: '/array',
  };

  handle(): number[] {
    return [1, 2, 4, 5];
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
  let httpServerRegistry: HttpServerRegistry;
  let httpServerHandler: HttpServerHandlerTest;

  let firstInterceptor: FirstInterceptor;
  let secondInterceptor: SecondInterceptor;

  beforeEach(async () => {
    const injector: Injector = await Injector.create([
      FirstInterceptor,
      SecondInterceptor,
    ]);

    httpServerRegistry = new HttpServerRegistry(new Logger(LoggerLevel.ALL, () => ''));
    httpServerHandler = new HttpServerHandlerTest(httpServerRegistry, injector);

    firstInterceptor = await injector.find(FirstInterceptor);
    secondInterceptor = await injector.find(SecondInterceptor);
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
    // not existing route - HttpException handling (should throw HttpException(500))
    // not existing route - Error handling (should throw HttpException(500))
    // not existing route - should throw HttpException(404)
    // not existing route - interceptors (global req interceptors -> {throw HttpException(404)} -> global res interceptors)

    // existing route - HttpException handling (should throw HttpException(500))
    // existing route - Error handling (should throw HttpException(500))
    // existing route - handling
    // existing route - serializing, Content-Type and Content-Length inference for response body
    // existing route - interceptors (global req interceptors -> handler -> global res interceptors)

    it('should', () => {
      expect(1).toBe(1);
    });
  });
});
