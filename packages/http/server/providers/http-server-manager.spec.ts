import { ApplicationRef, Injector, Logger, LoggerLevel, Validator } from '@caviajs/core';
import http from 'http';
import { HttpRouter } from './http-router';
import { HttpServer } from './http-server';
import { HttpServerHandler } from './http-server-handler';
import { HttpServerManager } from './http-server-manager';
import { HttpServerPort } from './http-server-port';
import { Url } from './url';
import { Cookies } from './cookies';

class MyApp {
}

describe('HttpServerManager', () => {
  let applicationRef: ApplicationRef;
  let cookies: Cookies;
  let logger: Logger;
  let validator: Validator;
  let httpRouter: HttpRouter;
  let httpServerHandler: HttpServerHandler;
  let httpServer: HttpServer;
  let httpServerPort: HttpServerPort;
  let httpServerManager: HttpServerManager;
  let url: Url;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'trace').mockImplementation(jest.fn());

    applicationRef = new MyApp();
    cookies = new Cookies();
    logger = new Logger(LoggerLevel.ALL, () => '');
    httpRouter = new HttpRouter(logger);
    validator = new Validator();
    url = new Url();
    httpServerHandler = new HttpServerHandler(applicationRef, cookies, httpRouter, await Injector.create([]), url, validator);
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
