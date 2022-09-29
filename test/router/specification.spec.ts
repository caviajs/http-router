import { Specification, HttpRouter } from '../../src';

it('should return the correct specification', () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({
      handler: () => '',
      method: 'GET',
      path: '/pigs',
    })
    .route({
      handler: () => '',
      metadata: {
        permissions: ['read:pigs'],
      },
      method: 'GET',
      path: '/pigs/:id',
    });

  expect(httpRouter.specification).toEqual(<Specification>{
    routes: [
      { metadata: undefined, method: 'GET', path: '/pigs' },
      { metadata: { permissions: ['read:pigs'] }, method: 'GET', path: '/pigs/:id' },
    ],
  });
});
