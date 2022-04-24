import path from 'path';
import { Env } from './providers/env';
import { Logger } from './providers/logger';
import { LOGGER_LEVEL, LoggerLevel } from './providers/logger-level';
import { LOGGER_MESSAGE_FACTORY } from './providers/logger-message-factory';
import { Storage } from './providers/storage';
import { Validator } from './providers/validator';
import { View } from './providers/view';
import { VIEW_DIRECTORY_PATH } from './providers/view-directory-path';
import { CaviaApplication } from './cavia-application';
import { CaviaFactory } from './cavia-factory';
import { CORE_CONTEXT } from './constants';
import { Injector } from './injector';
import { Body } from './providers/body';
import { BodyManager } from './providers/body-manager';
import { Cookies } from './providers/cookies';
import { Headers } from './providers/headers';
import { HttpClient } from './providers/http-client';
import { HttpServerRegistry } from './providers/http-server-registry';
import { HttpServerExplorer } from './providers/http-server-explorer';
import { HTTP_SERVER } from './providers/http-server';
import http from 'http';
import { HttpServerHandler } from './providers/http-server-handler';
import { HttpServerManager } from './providers/http-server-manager';
import { HTTP_SERVER_PORT } from './providers/http-server-port';
import { ScheduleExplorer } from './providers/schedule-explorer';
import { Schedule } from './providers/schedule';
import { ScheduleManager } from './providers/schedule-manager';

describe('CaviaFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should contain built-in providers', async () => {
      const application = await CaviaFactory.create({});

      expect(await application.injector.find(Body)).toBeInstanceOf(Body);
      expect(await application.injector.find(BodyManager)).toBeInstanceOf(BodyManager);
      expect(await application.injector.find(Cookies)).toBeInstanceOf(Cookies);
      expect(await application.injector.find(Env)).toBeInstanceOf(Env);
      expect(await application.injector.find(Headers)).toBeInstanceOf(Headers);
      expect(await application.injector.find(Injector)).toBeInstanceOf(Injector);
      expect(await application.injector.find(HttpClient)).toBeInstanceOf(HttpClient);
      expect(await application.injector.find(HTTP_SERVER)).toBeInstanceOf(http.Server);
      expect(await application.injector.find(HttpServerExplorer)).toBeInstanceOf(HttpServerExplorer);
      expect(await application.injector.find(HttpServerHandler)).toBeInstanceOf(HttpServerHandler);
      expect(await application.injector.find(HttpServerManager)).toBeInstanceOf(HttpServerManager);
      expect(await application.injector.find(HTTP_SERVER_PORT)).toEqual(3000);
      expect(await application.injector.find(HttpServerRegistry)).toBeInstanceOf(HttpServerRegistry);
      expect(await application.injector.find(Logger)).toBeInstanceOf(Logger);
      expect(await application.injector.find(LOGGER_LEVEL)).toEqual(LoggerLevel.ALL);
      expect(await application.injector.find(LOGGER_MESSAGE_FACTORY)).toEqual(expect.any(Function));
      expect(await application.injector.find(Schedule)).toBeInstanceOf(Schedule);
      expect(await application.injector.find(ScheduleExplorer)).toBeInstanceOf(ScheduleExplorer);
      expect(await application.injector.find(ScheduleManager)).toBeInstanceOf(ScheduleManager);
      expect(await application.injector.find(Storage)).toBeInstanceOf(Storage);
      expect(await application.injector.find(Validator)).toBeInstanceOf(Validator);
      expect(await application.injector.find(View)).toBeInstanceOf(View);
      expect(await application.injector.find(VIEW_DIRECTORY_PATH)).toEqual(path.join(process.cwd(), 'resources', 'views'));
    });

    it('should collect application providers', async () => {
      const application = await CaviaFactory.create({
        components: {
          providers: [
            { provide: 'foo-1', useValue: 10 },
            { provide: 'foo-2', useValue: 20 },
            { provide: 'bar-1', useValue: 30 },
            { provide: 'bar-2', useValue: 40 },
          ],
        },
      });

      expect(await application.injector.find('foo-1')).toEqual(10);
      expect(await application.injector.find('foo-2')).toEqual(20);
      expect(await application.injector.find('bar-1')).toEqual(30);
      expect(await application.injector.find('bar-2')).toEqual(40);
    });

    it('should determine the appropriate weighting of providers', async () => {
      const application = await CaviaFactory.create({
        components: {
          providers: [
            { provide: 'foo', useValue: 1 },
            { provide: 'foo', useValue: 2 },
            { provide: 'foo', useValue: 3 },
          ],
        },
      });

      expect(await application.injector.find('foo')).toEqual(3);
    });

    it('should use Logger', async () => {
      const loggerTraceSpy = jest.spyOn(Logger.prototype, 'trace');

      expect(loggerTraceSpy).toHaveBeenCalledTimes(0);

      await CaviaFactory.create({});

      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, 'Starting application...', CORE_CONTEXT);
    });

    it('should call a boot method on the CaviaApplication instance', async () => {
      const caviaApplicationBootSpy = jest.spyOn(CaviaApplication.prototype, 'boot');

      expect(caviaApplicationBootSpy).toHaveBeenCalledTimes(0);

      await CaviaFactory.create({});

      expect(caviaApplicationBootSpy).toHaveBeenNthCalledWith(1);
    });

    it('should return CaviaApplication instance', async () => {
      const application = await CaviaFactory.create({});

      expect(application).toBeInstanceOf(CaviaApplication);
    });
  });
});
