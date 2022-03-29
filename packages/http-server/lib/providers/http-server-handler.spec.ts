import { Logger, LoggerLevel } from '@caviajs/logger';
import { Readable, Stream } from 'stream';
import { HttpRouter } from './http-router';
import { HttpServerHandler } from './http-server-handler';

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
  let httpRouter: HttpRouter;
  let httpServerHandler: HttpServerHandler;

  beforeEach(() => {
    httpRouter = new HttpRouter(new Logger(LoggerLevel.ALL, () => ''));
    httpServerHandler = new HttpServerHandler(httpRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    // 1. not existing route
    // 2. existing route
    // 3. Serializing, Content-Type and Content-Length inference for response body
    // 4. exception handler

    it('a', () => {
      expect(1).toBe(1);
    });
  });
});
