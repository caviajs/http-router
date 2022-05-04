import http from 'http';
import { HttpServerRouter } from './http-server-router';
import { HttpServer } from './http-server';
import { HttpServerHandler } from './http-server-handler';
import { HttpServerManager } from './http-server-manager';
import { HttpServerPort } from './http-server-port';
import { Logger } from './logger';
import { Container } from '../container';
import { LoggerLevel } from './logger-level';
import { HTTP_CONTEXT } from '../constants';

describe('HttpServerManager', () => {
  let logger: Logger;
  let httpRouter: HttpServerRouter;
  let httpServerHandler: HttpServerHandler;
  let httpServer: HttpServer;
  let httpServerPort: HttpServerPort;
  let httpServerManager: HttpServerManager;

  beforeEach(async () => {
    logger = new Logger(LoggerLevel.OFF, () => '');
    httpRouter = new HttpServerRouter(logger);
    httpServerHandler = new HttpServerHandler(httpRouter, await Container.create([]));
    httpServer = http.createServer();
    httpServerPort = 3000;
    httpServerManager = new HttpServerManager(logger, httpServer, httpServerHandler, httpServerPort);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should add request handler', () => {
      const httpServerOnSpy: jest.SpyInstance = jest.spyOn(httpServer, 'on');

      httpServerManager.onApplicationBoot();

      expect(httpServerOnSpy).toHaveBeenNthCalledWith(1, 'request', expect.any(Function));
    });
  });

  describe('onApplicationListen', () => {
    it('should listen http server', async () => {
      const httpServerListenSpy: jest.SpyInstance = jest.spyOn(httpServer, 'listen').mockImplementation((port, cb) => cb() as any);
      const loggerTraceSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'trace');

      await httpServerManager.onApplicationListen();

      expect(httpServerListenSpy).toHaveBeenNthCalledWith(1, httpServerPort, expect.any(Function));
      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, `Http server listening at port ${ httpServerPort }`, HTTP_CONTEXT);
    });
  });

  describe('onApplicationShutdown', () => {
    it('should close http server', async () => {
      const httpServerCloseSpy: jest.SpyInstance = jest.spyOn(httpServer, 'close');
      const loggerTraceSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'trace');

      await httpServerManager.onApplicationShutdown();

      expect(httpServerCloseSpy).toHaveBeenNthCalledWith(1, expect.any(Function));
      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, `Http server has been stopped`, HTTP_CONTEXT);
    });
  });
});
