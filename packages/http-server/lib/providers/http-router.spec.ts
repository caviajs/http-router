import { Logger, LoggerLevel } from '@caviajs/logger';
import { HttpRouter, Route } from './http-router';
import { Injectable, Injector } from '@caviajs/core';
import { Interceptor } from '../types/interceptor';
import { Pipe } from '../types/pipe';
import { UseInterceptor } from '../decorators/use-interceptor';
import { Get } from '../decorators/route-mapping-get';
import { Controller } from '../decorators/controller';
import { Body } from '../decorators/route-param-body';
import { Post } from '../decorators/route-mapping-post';

jest.mock('@caviajs/logger');

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
  public getFoo(@Body() body) {
  }

  @UseInterceptor(AuthInterceptor, ['admin:foo:create'])
  @Post('create')
  public postFoo() {
  }
}

@UseInterceptor(AuthInterceptor, ['admin:bar'])
@Controller('bar')
class BarController {
  @Get()
  public getBar() {
  }
}

class HttpRouterTest extends HttpRouter {
  public readonly routes: Route[] = [];
}

describe('HttpRouter', () => {
  let injector: Injector;
  let httpRouter: HttpRouterTest;

  beforeEach(async () => {
    const logger = new Logger(LoggerLevel.ALL, () => '');

    injector = await Injector.create([AuthInterceptor, ValidatePipe, FooController, BarController]);
    httpRouter = new HttpRouterTest(injector, logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should collect the relevant metadata', async () => {
      await httpRouter.onApplicationBoot();


    });
  });

  // describe('match', () => {
  //   it('znalezc', () => {
  //   });
  //
  //   it('nie znalezc', () => {
  //   });
  // });

  // describe('register', () => {
  //   it('zarejestrowac', () => {
  //     const route: Route = {
  //       controllerConstructor: ExampleController,
  //       controllerInstance: exampleController,
  //       controllerInterceptors: [],
  //       routeHandler: exampleController.getUsers,
  //       routeInterceptors: [],
  //       routeParams: [],
  //       method: 'GET',
  //       path: 'users',
  //     };
  //
  //     const httpRouterPushSpy = jest.spyOn(httpRouter.routes.push, 'constructor');
  //
  //     httpRouter.register(route);
  //
  //     expect(httpRouterPushSpy).toHaveBeenNthCalledWith(1, route);
  //   });
  //
  //   // it('duplikat', () => {
  //   // });
  // });
});
