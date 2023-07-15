import { HttpRouter } from '../src';

it('should merge HttpRouter with another HttpRouter', () => {
  const coreHttpRouter = new HttpRouter();
  coreHttpRouter.route = jest.fn();

  const firstHttpRouter = new HttpRouter();
  const firstGlobalInterceptor = jest.fn();
  const secondGlobalInterceptor = jest.fn();

  firstHttpRouter
    .intercept(firstGlobalInterceptor)
    .intercept(secondGlobalInterceptor);

  const fooHandler = jest.fn();
  const fooInterceptor = jest.fn();

  firstHttpRouter
    .route({
      handler: fooHandler,
      interceptors: [fooInterceptor],
      method: 'GET',
      path: '/foo',
    });

  expect(coreHttpRouter.route).toBeCalledTimes(0);

  coreHttpRouter
    .merge(firstHttpRouter);

  expect(coreHttpRouter.route).toBeCalledTimes(1);
  expect(coreHttpRouter.route).toBeCalledWith({
    handler: fooHandler,
    interceptors: [firstGlobalInterceptor, secondGlobalInterceptor, fooInterceptor],
    metadata: undefined,
    method: 'GET',
    path: '/foo',
  });
});
