import { Readable, Stream } from 'stream';
import { HttpServerRegistry } from './http-server-registry';
import { HttpServerHandler } from './http-server-handler';
import { Logger } from './logger';
import { LoggerLevel } from './logger-level';
import { Injector } from '../injector';

class FooController {
  public getUndefined(): undefined {
    return undefined;
  }

  public getBuffer(): Buffer {
    return Buffer.from('Hello World');
  }

  public getStream(): Stream {
    return Readable.from('Hello World');
  }

  public getString(): string {
    return 'Hello World';
  }

  public getTrue(): boolean {
    return true;
  }

  public getFalse(): boolean {
    return false;
  }

  public getNumber(): number {
    return 1245;
  }

  public getObject(): object {
    return { foo: 'bar' };
  }

  public getArray(): object {
    return [1, 2, 4, 5];
  }
}

describe('HttpServerHandler', () => {
  let httpRouter: HttpServerRegistry;
  let httpServerHandler: HttpServerHandler;

  beforeEach(async () => {
    httpRouter = new HttpServerRegistry(new Logger(LoggerLevel.ALL, () => ''));
    httpServerHandler = new HttpServerHandler({} as any, httpRouter, await Injector.create([]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    // global interceptors
    // global interceptors - throws error if not existing in Injector
  });

  describe('handle', () => {
    // not existing route - exception handling
    // not existing route - interceptors (global req -> {throw ...} -> global res)

    // existing route - handling
    // existing route - serializing, Content-Type and Content-Length inference for response body
    // existing route - exception handling
    // existing route - interceptors (global req -> controller req -> route req -> handler -> route res -> controller res -> global res)

    it('should', () => {
      expect(1).toBe(1);
    });
  });
});
