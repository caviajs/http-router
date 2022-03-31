import { Logger, LoggerLevel } from '@caviajs/logger';
import http from 'http';
import { HttpRouter } from './http-router';
import { HttpServer } from './http-server';
import { HttpServerHandler } from './http-server-handler';
import { HttpServerManager } from './http-server-manager';
import { HttpServerPort } from './http-server-port';

jest.mock('@caviajs/logger');

describe('HttpServerManager', () => {
  let logger: Logger;
  let httpRouter: HttpRouter;
  let httpServerHandler: HttpServerHandler;
  let httpServer: HttpServer;
  let httpServerPort: HttpServerPort;
  let httpServerManager: HttpServerManager;

  beforeEach(async () => {
    logger = new Logger(LoggerLevel.ALL, () => '');
    httpRouter = new HttpRouter(logger);
    httpServerHandler = new HttpServerHandler(httpRouter);
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
      const httpServerListenSpy: jest.SpyInstance = jest
        .spyOn(httpServer, 'listen')
        .mockImplementation((port, cb) => cb() as any);

      await httpServerManager.onApplicationListen();

      expect(httpServerListenSpy).toHaveBeenNthCalledWith(1, httpServerPort, expect.any(Function));
    });
  });

  describe('onApplicationShutdown', () => {
    it('should close http server', async () => {
      const httpServerCloseSpy = jest.spyOn(httpServer, 'close');

      await httpServerManager.onApplicationShutdown();

      expect(httpServerCloseSpy).toHaveBeenNthCalledWith(1, expect.any(Function));
    });
  });
});
