import { HttpRouter } from '../src';

it('should thrown an Error if duplicate routes are detected', () => {
  try {
    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .route({ handler: () => '', method: 'GET', path: '/pigs' })
      .route({ handler: () => '', method: 'GET', path: '/pigs' });
  } catch (error) {
    expect(error.message).toBe('Duplicated {GET /pigs} http route');
  }
});
