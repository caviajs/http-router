import { Specification, HttpRouter } from '../src';

it('should return the correct specification', () => {
  const httpRouter: HttpRouter = new HttpRouter();

  const globalInterceptor = jest.fn();

  httpRouter
    .intercept(globalInterceptor);

  const handler1 = jest.fn();
  const handler2 = jest.fn();

  const routeInterceptor = jest.fn();

  httpRouter
    .route({
      handler: handler1,
      interceptors: [routeInterceptor],
      method: 'GET',
      path: '/pigs',
    })
    .route({
      handler: handler2,
      metadata: {
        permissions: ['read:pigs'],
      },
      method: 'GET',
      path: '/pigs/:id',
    });

  expect(httpRouter.specification).toEqual(<Specification>{
    interceptors: [globalInterceptor],
    routes: [
      {
        handler: handler1,
        interceptors: [routeInterceptor],
        metadata: undefined,
        method: 'GET',
        path: '/pigs',
      },
      {
        handler: handler2,
        interceptors: undefined,
        metadata: { permissions: ['read:pigs'] },
        method: 'GET',
        path: '/pigs/:id',
      },
    ],
  });
});
