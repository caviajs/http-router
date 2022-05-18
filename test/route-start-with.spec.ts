import { HttpRouter } from '../src';

it('should thrown an Error if path does not start with /', () => {
  try {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .route({ handler: () => '', method: 'GET', path: 'pigs' });
  } catch (error) {
    expect(error.message).toBe(`The route path in 'GET pigs' should start with '/'`);
  }
});
