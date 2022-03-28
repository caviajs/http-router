import { Logger, LoggerLevel } from '@caviajs/logger';
import { HttpRouter, Route } from './http-router';
import { LOGGER_CONTEXT } from '../http-constants';

jest.mock('@caviajs/logger');

class HttpRouterTest extends HttpRouter {
  public readonly routes: Route[] = [];
}

class FooController {
  foo() {
  }
}

describe('HttpRouter', () => {
  let fooController: FooController;
  let httpRouter: HttpRouterTest;

  let route: Route;

  beforeEach(async () => {
    const logger = new Logger(LoggerLevel.ALL, () => '');

    fooController = new FooController();
    httpRouter = new HttpRouterTest(logger);

    route = {
      controllerConstructor: FooController,
      controllerInstance: fooController,
      controllerInterceptors: [],
      method: 'GET',
      path: 'users',
      routeHandler: fooController.foo,
      routeHandlerInterceptors: [],
      routeHandlerParams: [],
      routeHandlerPipes: [],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('zarejestrowac', () => {
      httpRouter.add(route);

      expect(httpRouter.routes).toEqual([route]);
    });

    it('logować', () => {
      httpRouter.add(route);

      expect(Logger.prototype.trace).toHaveBeenNthCalledWith(1, `Mapped {${ route.path }, ${ route.method }} HTTP route`, LOGGER_CONTEXT);
    });

    it('duplikat', () => {
      try {
        httpRouter.add(route);
        httpRouter.add(route);
      } catch (e) {
        expect(e.message).toEqual(`Duplicated {${ route.path }, ${ route.method }} HTTP route`);
      }
    });
  });

  // describe('match', () => {
  //   it('znalezc', () => {
  //   });
  //
  //   it('nie znalezc', () => {
  //   });
  // });
});
