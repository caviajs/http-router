import { HttpRouter } from '../src';

it('should merge HttpRouter with another HttpRouter', () => {
  const httpRouter = new HttpRouter();
  httpRouter.route = jest.fn();

  const fooGlobalInterceptor = jest.fn();
  const barGlobalInterceptor = jest.fn();
  const fooHandler = jest.fn();
  const fooInterceptor = jest.fn();

  expect(httpRouter.route).toBeCalledTimes(0);

  httpRouter
    .group(builder => {
      return builder
        .intercept(fooGlobalInterceptor)
        .intercept(barGlobalInterceptor)
        .route({
          handler: fooHandler,
          interceptors: [fooInterceptor],
          method: 'GET',
          path: '/foo',
        });
    });

  expect(httpRouter.route).toBeCalledTimes(1);
  expect(httpRouter.route).toBeCalledWith({
    handler: fooHandler,
    interceptors: [fooGlobalInterceptor, barGlobalInterceptor, fooInterceptor],
    metadata: undefined,
    method: 'GET',
    path: '/foo',
  });
});
