import { getProviderName, Injectable, Injector, Logger, LoggerLevel } from '@caviajs/core';
import { Controller } from '../decorators/controller';
import { UseInterceptor } from '../decorators/use-interceptor';
import { Interceptor } from '../types/interceptor';
import { HttpRouter, Route } from './http-router';
import { HttpRouterManager } from './http-router-manager';
import { RouteMapping } from '../decorators/route-mapping';

@Injectable()
class FooInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

@Injectable()
class BarInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

@Controller('foo')
class FooController {
  @UseInterceptor(FooInterceptor, ['admin:foo:get'])
  @RouteMapping('GET', '/')
  public getFoo() {
  }

  @UseInterceptor(FooInterceptor, ['admin:foo:create'])
  @UseInterceptor(BarInterceptor, ['admin:foo:create'])
  @RouteMapping('POST', 'create')
  public postFoo() {
  }
}

@UseInterceptor(FooInterceptor, ['admin:bar'])
@UseInterceptor(BarInterceptor, ['admin:bar'])
@Controller('bar')
class BarController {
  @RouteMapping('GET', ':id')
  public getBar() {
  }
}

describe('HttpRouterManager', () => {
  const httpRouter: HttpRouter = new HttpRouter(new Logger(LoggerLevel.ALL, () => ''));

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should add the appropriate routs according to the metadata', async () => {
      const injector: Injector = await Injector.create([FooInterceptor, BarInterceptor, FooController, BarController]);
      const fooInterceptor: FooInterceptor = await injector.find(FooInterceptor);
      const barInterceptor: BarInterceptor = await injector.find(BarInterceptor);
      const fooController: FooController = await injector.find(FooController);
      const barController: BarController = await injector.find(BarController);

      const httpRouterManager: HttpRouterManager = new HttpRouterManager(httpRouter, injector);
      const httpRouterPushSpy: jest.SpyInstance = jest.spyOn(httpRouter, 'push').mockImplementation(jest.fn());

      expect(httpRouterPushSpy).toHaveBeenCalledTimes(0);

      await httpRouterManager.onApplicationBoot();

      expect(httpRouterPushSpy).toHaveBeenCalledTimes(3);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controller: fooController,
        handler: fooController.getFoo,
        interceptors: [
          { args: ['admin:foo:get'], interceptor: fooInterceptor },
        ],
        method: 'GET',
        path: '/foo',
        schema: {
          requestBody: undefined,
          requestCookies: undefined,
          requestHeaders: undefined,
          requestParams: undefined,
          requestQuery: undefined,
          responseBody: undefined,
          responseHeaders: undefined,
        },
      } as Route);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controller: fooController,
        handler: fooController.postFoo,
        interceptors: [
          { args: ['admin:foo:create'], interceptor: fooInterceptor },
          { args: ['admin:foo:create'], interceptor: barInterceptor },
        ],
        method: 'POST',
        path: '/foo/create',
        schema: {
          requestBody: undefined,
          requestCookies: undefined,
          requestHeaders: undefined,
          requestParams: undefined,
          requestQuery: undefined,
          responseBody: undefined,
          responseHeaders: undefined,
        },
      } as Route);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controller: barController,
        handler: barController.getBar,
        interceptors: [
          { args: ['admin:bar'], interceptor: fooInterceptor },
          { args: ['admin:bar'], interceptor: barInterceptor },
        ],
        method: 'GET',
        path: '/bar/:id',
        schema: {
          requestBody: undefined,
          requestCookies: undefined,
          requestHeaders: undefined,
          requestParams: undefined,
          requestQuery: undefined,
          responseBody: undefined,
          responseHeaders: undefined,
        },
      } as Route);
    });

    it('should throw an exception if the interceptor cannot resolve', async () => {
      const injector: Injector = await Injector.create([BarInterceptor, FooController, BarController]);
      const httpRouterManager: HttpRouterManager = new HttpRouterManager(httpRouter, injector);

      await expect(httpRouterManager.onApplicationBoot())
        .rejects
        .toThrow(`Cavia can't resolve interceptor '${ getProviderName(FooInterceptor) }'`);
    });
  });
});
