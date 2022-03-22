import { Logger, LoggerLevel } from '@caviajs/logger';
import http from 'http';
import { HttpServerManager } from './http-server-manager';
import { HttpRouter } from './http-router';
import { HttpServer } from './http-server';
import { HttpServerPort } from './http-server-port';

jest.mock('@caviajs/logger');

describe('HttpServerManager', () => {
  let logger: Logger;
  let httpRouter: HttpRouter;
  let httpServer: HttpServer;
  let httpServerPort: HttpServerPort;
  let httpServerManager: HttpServerManager;

  beforeEach(() => {
    logger = new Logger(LoggerLevel.ALL, () => '');
    httpRouter = new HttpRouter(logger);
    httpServer = http.createServer();
    httpServerPort = 3000;
    httpServerManager = new HttpServerManager(logger, httpRouter, httpServer, httpServerPort);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should add request handler', () => {
      const httpServerOnSpy: jest.SpyInstance = jest.spyOn(httpServer, 'on');

      httpServerManager.onApplicationBoot();

      expect(httpServerOnSpy).toHaveBeenNthCalledWith(1, 'request', httpRouter.handle);
    });
  });

  describe('onApplicationListen', () => {
    it('should listen http server', () => {
      const httpServerListenSpy: jest.SpyInstance = jest.spyOn(httpServer, 'listen');

      httpServerManager.onApplicationListen();

      expect(httpServerListenSpy).toHaveBeenNthCalledWith(1, httpServerPort, expect.any(Function));
    });
  });

  describe('onApplicationShutdown', () => {
    it('should close http server', () => {
      const httpServerCloseSpy = jest.spyOn(httpServer, 'close');

      httpServerManager.onApplicationShutdown();

      expect(httpServerCloseSpy).toHaveBeenNthCalledWith(1, expect.any(Function));
    });
  });
});
