import path from 'path';
import { Application } from './decorators/application';
import { APPLICATION_REF } from './providers/application-ref';
import { Env } from './providers/env';
import { ENV_PATH } from './providers/env-path';
import { Logger } from './providers/logger';
import { LOGGER_LEVEL, LoggerLevel } from './providers/logger-level';
import { LOGGER_MESSAGE_FACTORY } from './providers/logger-message-factory';
import { Storage } from './providers/storage';
import { Validator } from './providers/validator';
import { View } from './providers/view';
import { VIEW_DIRECTORY_PATH } from './providers/view-directory-path';
import { CaviaApplication } from './cavia-application';
import { CaviaFactory } from './cavia-factory';
import { LOGGER_CONTEXT } from './constants';
import { Injector } from './injector';
import { Body } from './providers/body';
import { BodyManager } from './providers/body-manager';
import { Cookies } from './providers/cookies';
import { Headers } from './providers/headers';
import { HttpClient } from './providers/http-client';
import { HttpRouter } from './providers/http-router';
import { HttpRouterManager } from './providers/http-router-manager';
import { HTTP_SERVER } from './providers/http-server';
import http from 'http';
import { HttpServerHandler } from './providers/http-server-handler';
import { HttpServerManager } from './providers/http-server-manager';
import { HTTP_SERVER_PORT } from './providers/http-server-port';
import { ENV_SCHEMA } from './providers/env-schema';

describe('CaviaFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an exception if the class is not marked with the @Application decorator', async () => {
      class MyApp {
      }

      try {
        await CaviaFactory.create(MyApp);
      } catch (e) {
        expect(e.message).toBe(`The '${ MyApp.name }' should be annotated as an application`);
      }
    });

    it('should contain built-in providers', async () => {
      @Application()
      class MyApp {
      }

      const application = await CaviaFactory.create(MyApp);

      expect(await application.injector.find(APPLICATION_REF)).toBeInstanceOf(MyApp);
      expect(await application.injector.find(Body)).toBeInstanceOf(Body);
      expect(await application.injector.find(BodyManager)).toBeInstanceOf(BodyManager);
      expect(await application.injector.find(Cookies)).toBeInstanceOf(Cookies);
      expect(await application.injector.find(Env)).toBeInstanceOf(Env);
      expect(await application.injector.find(ENV_PATH)).toEqual(path.join(process.cwd(), '.env'));
      expect(await application.injector.find(ENV_SCHEMA)).toEqual({});
      expect(await application.injector.find(Headers)).toBeInstanceOf(Headers);
      expect(await application.injector.find(Injector)).toBeInstanceOf(Injector);
      expect(await application.injector.find(HttpClient)).toBeInstanceOf(HttpClient);
      expect(await application.injector.find(HttpRouter)).toBeInstanceOf(HttpRouter);
      expect(await application.injector.find(HttpRouterManager)).toBeInstanceOf(HttpRouterManager);
      expect(await application.injector.find(HTTP_SERVER)).toBeInstanceOf(http.Server);
      expect(await application.injector.find(HttpServerHandler)).toBeInstanceOf(HttpServerHandler);
      expect(await application.injector.find(HttpServerManager)).toBeInstanceOf(HttpServerManager);
      expect(await application.injector.find(HTTP_SERVER_PORT)).toEqual(3000);
      expect(await application.injector.find(Logger)).toBeInstanceOf(Logger);
      expect(await application.injector.find(LOGGER_LEVEL)).toEqual(LoggerLevel.ALL);
      expect(await application.injector.find(LOGGER_MESSAGE_FACTORY)).toEqual(expect.any(Function));
      expect(await application.injector.find(Storage)).toBeInstanceOf(Storage);
      expect(await application.injector.find(Validator)).toBeInstanceOf(Validator);
      expect(await application.injector.find(View)).toBeInstanceOf(View);
      expect(await application.injector.find(VIEW_DIRECTORY_PATH)).toEqual(path.join(process.cwd(), 'resources', 'views'));
    });

    it('should collect application providers', async () => {
      @Application({
        packages: [
          { providers: [{ provide: 'foo-1', useValue: 10 }] },
          { providers: [{ provide: 'foo-2', useValue: 20 }] },
        ],
        providers: [
          { provide: 'bar-1', useValue: 30 },
          { provide: 'bar-2', useValue: 40 },
        ],
      })
      class MyApp {
      }

      const application = await CaviaFactory.create(MyApp);

      expect(await application.injector.find('foo-1')).toEqual(10);
      expect(await application.injector.find('foo-2')).toEqual(20);
      expect(await application.injector.find('bar-1')).toEqual(30);
      expect(await application.injector.find('bar-2')).toEqual(40);
    });

    it('should determine the appropriate weighting of providers', async () => {
      @Application({
        packages: [
          { providers: [{ provide: 'foo', useValue: 1 }] },
        ],
        providers: [
          { provide: 'foo', useValue: 2 },
          { provide: 'foo', useValue: 3 },
        ],
      })
      class MyApp {
      }

      const application = await CaviaFactory.create(MyApp);

      expect(await application.injector.find('foo')).toEqual(3);
    });

    it('should use Logger', async () => {
      const loggerTraceSpy = jest.spyOn(Logger.prototype, 'trace');

      @Application()
      class MyApp {
      }

      expect(loggerTraceSpy).toHaveBeenCalledTimes(0);

      await CaviaFactory.create(MyApp);

      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, 'Starting application...', LOGGER_CONTEXT);
    });

    it('should call a boot method on the CaviaApplication instance', async () => {
      const caviaApplicationBootSpy = jest.spyOn(CaviaApplication.prototype, 'boot');

      @Application()
      class MyApp {
      }

      expect(caviaApplicationBootSpy).toHaveBeenCalledTimes(0);

      await CaviaFactory.create(MyApp);

      expect(caviaApplicationBootSpy).toHaveBeenNthCalledWith(1);
    });

    it('should return CaviaApplication instance', async () => {
      @Application()
      class MyApp {
      }

      const application = await CaviaFactory.create(MyApp);

      expect(application).toBeInstanceOf(CaviaApplication);
    });
  });
});
