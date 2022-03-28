import { Injectable, Injector } from '@caviajs/core';
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

@Injectable()
class AuthInterceptor implements Interceptor {
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
  @UseInterceptor(AuthInterceptor, ['admin:foo:get'])
  @Get()
  public getFoo(@UsePipe(ValidatePipe, ['foo']) @Body() body) {
  }

  @UseInterceptor(AuthInterceptor, ['admin:foo:create'])
  @Post('create')
  public postFoo(@UsePipe(ValidatePipe) request) {
  }
}

@UseInterceptor(AuthInterceptor, ['admin:bar'])
@Controller('bar')
class BarController {
  @Get(':id')
  public getBar(@Params(':id') id) {
  }
}

describe('HttpRouterManager', () => {
  let httpRouterManager: HttpRouterManager;

  let httpRouterAddSpy: jest.SpyInstance;

  let authInterceptor: AuthInterceptor;
  let validatePipe: ValidatePipe;
  let fooController: FooController;
  let barController: BarController;

  beforeEach(async () => {
    const injector = await Injector.create([AuthInterceptor, ValidatePipe, FooController, BarController]);
    const httpRouter = new HttpRouter(new Logger(LoggerLevel.ALL, () => ''));

    httpRouterManager = new HttpRouterManager(httpRouter, injector);
    httpRouterAddSpy = jest.spyOn(httpRouter, 'add').mockImplementation(jest.fn());

    authInterceptor = await injector.find(AuthInterceptor);
    validatePipe = await injector.find(ValidatePipe);
    fooController = await injector.find(FooController);
    barController = await injector.find(BarController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should collect the relevant metadata', async () => {
      expect(httpRouterAddSpy).toHaveBeenCalledTimes(0);

      await httpRouterManager.onApplicationBoot();

      expect(httpRouterAddSpy).toHaveBeenCalledTimes(3);
      expect(httpRouterAddSpy).toHaveBeenCalledWith({
        controllerConstructor: FooController,
        controllerInstance: fooController,
        controllerInterceptors: [],
        method: 'GET',
        path: '/foo',
        routeHandler: fooController.getFoo,
        routeHandlerInterceptors: [
          { args: ['admin:foo:get'], interceptor: authInterceptor },
        ],
        routeHandlerParams: [
          { data: undefined, factory: bodyRouteParamDecoratorFactory, index: 0 },
        ],
        routeHandlerPipes: [
          { args: ['foo'], pipe: validatePipe, index: 0 }
        ],
      } as Route);
      expect(httpRouterAddSpy).toHaveBeenCalledWith({
        controllerConstructor: FooController,
        controllerInstance: fooController,
        controllerInterceptors: [],
        method: 'POST',
        path: '/foo/create',
        routeHandler: fooController.postFoo,
        routeHandlerInterceptors: [
          { args: ['admin:foo:create'], interceptor: authInterceptor },
        ],
        routeHandlerParams: [
          { data: undefined, factory: bodyRouteParamDecoratorFactory, index: 0 },
        ],
        routeHandlerPipes: [
          { args: ['foo'], pipe: validatePipe, index: 0 }
        ],
      } as Route);
      expect(httpRouterAddSpy).toHaveBeenCalledWith({
        controllerConstructor: BarController,
        controllerInstance: barController,
        controllerInterceptors: [
          { args: ['admin:bar'], interceptor: authInterceptor },
        ],
        method: 'GET',
        path: '/bar/:id',
        routeHandler: barController.getBar,
        routeHandlerInterceptors: [],
        routeHandlerParams: [
          { data: 'username', factory: paramsRouteParamDecoratorFactory, index: 0 },
        ],
        routeHandlerPipes: [],
      } as Route);
    });
  });
});
