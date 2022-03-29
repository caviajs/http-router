import { getProviderName, Injectable, Injector } from '@caviajs/core';
import { Logger, LoggerLevel } from '@caviajs/logger';
import { Controller } from '../decorators/controller';
import { Get } from '../decorators/route-mapping-get';
import { Post } from '../decorators/route-mapping-post';
import { Body, bodyRouteParamDecoratorFactory } from '../decorators/route-param-body';
import { Params, paramsRouteParamDecoratorFactory } from '../decorators/route-param-params';
import { UseInterceptor } from '../decorators/use-interceptor';
import { UsePipe } from '../decorators/use-pipe';
import { Interceptor } from '../types/interceptor';
import { Pipe } from '../types/pipe';
import { HttpRouter, Route } from './http-router';
import { HttpRouterManager } from './http-router-manager';
import { Request } from '../types/request';

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

@Injectable()
class ValidatePipe implements Pipe {
  transform(value, metadata) {
    return value;
  }
}

@Controller('foo')
class FooController {
  @UseInterceptor(FooInterceptor, ['admin:foo:get'])
  @Get()
  public getFoo(@UsePipe(ValidatePipe, ['foo']) @Body() body) {
  }

  @UseInterceptor(FooInterceptor, ['admin:foo:create'])
  @UseInterceptor(BarInterceptor, ['admin:foo:create'])
  @Post('create')
  public postFoo(@UsePipe(ValidatePipe) request: Request) {
  }
}

@UseInterceptor(FooInterceptor, ['admin:bar'])
@UseInterceptor(BarInterceptor, ['admin:bar'])
@Controller('bar')
class BarController {
  @Get(':id')
  public getBar(@UsePipe(ValidatePipe) @Params('id') id: String) {
  }
}

describe('HttpRouterManager', () => {
  const httpRouter: HttpRouter = new HttpRouter(new Logger(LoggerLevel.ALL, () => ''));

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should add the appropriate routs according to the metadata', async () => {
      const injector: Injector = await Injector.create([FooInterceptor, BarInterceptor, ValidatePipe, FooController, BarController]);
      const fooInterceptor: FooInterceptor = await injector.find(FooInterceptor);
      const barInterceptor: BarInterceptor = await injector.find(BarInterceptor);
      const validatePipe: ValidatePipe = await injector.find(ValidatePipe);
      const fooController: FooController = await injector.find(FooController);
      const barController: BarController = await injector.find(BarController);

      const httpRouterManager: HttpRouterManager = new HttpRouterManager(httpRouter, injector);
      const httpRouterPushSpy: jest.SpyInstance = jest.spyOn(httpRouter, 'push').mockImplementation(jest.fn());

      expect(httpRouterPushSpy).toHaveBeenCalledTimes(0);

      await httpRouterManager.onApplicationBoot();

      expect(httpRouterPushSpy).toHaveBeenCalledTimes(3);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controllerConstructor: FooController,
        controllerInstance: fooController,
        controllerInterceptors: [],
        method: 'GET',
        path: '/foo',
        routeHandler: fooController.getFoo,
        routeHandlerInterceptors: [
          { args: ['admin:foo:get'], interceptor: fooInterceptor },
        ],
        routeHandlerParams: [
          { data: undefined, factory: bodyRouteParamDecoratorFactory, index: 0 },
        ],
        routeHandlerPipes: [
          { args: ['foo'], metaType: Object, pipe: validatePipe, index: 0 }
        ],
      } as Route);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controllerConstructor: FooController,
        controllerInstance: fooController,
        controllerInterceptors: [],
        method: 'POST',
        path: '/foo/create',
        routeHandler: fooController.postFoo,
        routeHandlerInterceptors: [
          { args: ['admin:foo:create'], interceptor: fooInterceptor },
          { args: ['admin:foo:create'], interceptor: barInterceptor },
        ],
        routeHandlerParams: [],
        routeHandlerPipes: [
          { args: [], metaType: Object, pipe: validatePipe, index: 0 }
        ],
      } as Route);
      expect(httpRouterPushSpy).toHaveBeenCalledWith({
        controllerConstructor: BarController,
        controllerInstance: barController,
        controllerInterceptors: [
          { args: ['admin:bar'], interceptor: fooInterceptor },
          { args: ['admin:bar'], interceptor: barInterceptor },
        ],
        method: 'GET',
        path: '/bar/:id',
        routeHandler: barController.getBar,
        routeHandlerInterceptors: [],
        routeHandlerParams: [
          { data: 'id', factory: paramsRouteParamDecoratorFactory, index: 0 },
        ],
        routeHandlerPipes: [
          { args: [], metaType: String, pipe: validatePipe, index: 0 },
        ],
      } as Route);
    });

    it('should throw an exception if the interceptor cannot resolve', async () => {
      const injector: Injector = await Injector.create([BarInterceptor, ValidatePipe, FooController, BarController]);
      const httpRouterManager: HttpRouterManager = new HttpRouterManager(httpRouter, injector);

      await expect(httpRouterManager.onApplicationBoot())
        .rejects
        .toThrow(`Cavia can't resolve interceptor '${ getProviderName(FooInterceptor) }'`);
    });

    it('should throw an exception if the pipe cannot resolve', async () => {
      const injector: Injector = await Injector.create([BarInterceptor, FooInterceptor, FooController, BarController]);
      const httpRouterManager: HttpRouterManager = new HttpRouterManager(httpRouter, injector);

      await expect(httpRouterManager.onApplicationBoot())
        .rejects
        .toThrow(`Cavia can't resolve pipe '${ getProviderName(ValidatePipe) }'`);
    });
  });
});
