import { ApiSpec, HttpRouter } from '../src';

describe('Api spec', () => {
  it('should return the correct ApiSpec', () => {
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

    expect(httpRouter.apiSpec).toEqual(<ApiSpec>{
      routes: [
        { metadata: undefined, method: 'GET', path: '/pigs' },
        { metadata: { permissions: ['read:pigs'] }, method: 'GET', path: '/pigs/:id' },
      ],
    });
  });
});
