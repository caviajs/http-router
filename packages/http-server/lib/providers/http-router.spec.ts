import { Logger, LoggerLevel } from '@caviajs/logger';
import { HttpRouter, Route } from './http-router';

jest.mock('@caviajs/logger');

class HttpRouterTest extends HttpRouter {
  public readonly routes: Route[] = [];
}

describe('HttpRouter', () => {
  let httpRouter: HttpRouterTest;

  beforeEach(async () => {
    const logger = new Logger(LoggerLevel.ALL, () => '');

    httpRouter = new HttpRouterTest(logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should', () => {
    expect(1).toBe(1);
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
