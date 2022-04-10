import { Logger, LoggerLevel } from '@caviajs/core';
import { HttpRouter, Route } from './http-router';
import { LOGGER_CONTEXT } from '../http-constants';

class HttpRouterTest extends HttpRouter {
  public readonly routes: Route[] = [];
}

class FooController {
  getUsers() {
  }

  createUser() {
  }
}

describe('HttpRouter', () => {
  const fooController: FooController = new FooController();
  const route1: Route = {
    controllerConstructor: FooController,
    controllerInstance: fooController,
    controllerInterceptors: [],
    method: 'GET',
    path: 'users',
    routeHandler: fooController.getUsers,
    routeHandlerInterceptors: [],
  };
  const route2: Route = {
    controllerConstructor: FooController,
    controllerInstance: fooController,
    controllerInterceptors: [],
    method: 'POST',
    path: 'users',
    routeHandler: fooController.createUser,
    routeHandlerInterceptors: [],
  };

  const loggerTraceSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'trace').mockImplementation(jest.fn());

  let httpRouter: HttpRouterTest;

  beforeEach(() => {
    httpRouter = new HttpRouterTest(new Logger(LoggerLevel.ALL, () => ''));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return matched route if it exists in router', () => {
      httpRouter.push(route1);

      expect(httpRouter.find(route1.method, route1.path)).toEqual(route1);
    });

    it('should return matched undefined if it does not exist in the registry', () => {
      expect(httpRouter.find(route1.method, route1.path)).toBeUndefined();
    });
  });

  describe('push', () => {
    it('should correctly register new routes', () => {
      httpRouter.push(route1);
      httpRouter.push(route2);

      expect(httpRouter.routes).toEqual([route1, route2]);
    });

    it('should correctly log after adding a new route', () => {
      httpRouter.push(route1);
      httpRouter.push(route2);

      expect(loggerTraceSpy).toHaveBeenCalledTimes(2);
      expect(loggerTraceSpy).toHaveBeenCalledWith(`Mapped {${ route1.path }, ${ route1.method }} HTTP route`, LOGGER_CONTEXT);
      expect(loggerTraceSpy).toHaveBeenCalledWith(`Mapped {${ route2.path }, ${ route2.method }} HTTP route`, LOGGER_CONTEXT);
    });

    it('should throw an exception if a duplicate occurs', () => {
      try {
        httpRouter.push(route1);
        httpRouter.push(route1);
      } catch (e) {
        expect(e.message).toEqual(`Duplicated {${ route1.path }, ${ route1.method }} HTTP route`);
      }
    });
  });
});
