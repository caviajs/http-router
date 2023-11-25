import { HttpRouter } from '../src';

it('should thrown an Error if duplicate routes are detected (static + static)', done => {
  try {
    new HttpRouter()
      .route({ handler: () => '', method: 'GET', path: '/pigs' })
      .route({ handler: () => '', method: 'GET', path: '/pigs' });
  } catch (error) {
    expect(error.message).toBe('Duplicated {GET /pigs} http route');

    done();
  }
});

it('should thrown an Error if duplicate routes are detected (static + parameter)', done => {
  try {
    new HttpRouter()
      .route({ handler: () => '', method: 'GET', path: '/pigs/list' })
      .route({ handler: () => '', method: 'GET', path: '/pigs/:id' });
  } catch (error) {
    expect(error.message).toBe('Duplicated {GET /pigs/:id} http route');

    done();
  }
});

it('should thrown an Error if duplicate routes are detected (static + optional parameter)', done => {
  try {
    new HttpRouter()
      .route({ handler: () => '', method: 'GET', path: '/pigs/list' })
      .route({ handler: () => '', method: 'GET', path: '/pigs/:id?' });
  } catch (error) {
    expect(error.message).toBe('Duplicated {GET /pigs/:id?} http route');

    done();
  }
});

it('should thrown an Error if duplicate routes are detected (parameter + static)', done => {
  try {
    new HttpRouter()
      .route({ handler: () => '', method: 'GET', path: '/pigs/:id' })
      .route({ handler: () => '', method: 'GET', path: '/pigs/list' });
  } catch (error) {
    expect(error.message).toBe('Duplicated {GET /pigs/list} http route');

    done();
  }
});

it('should thrown an Error if duplicate routes are detected (optional parameter + static)', done => {
  try {
    new HttpRouter()
      .route({ handler: () => '', method: 'GET', path: '/pigs/:id?' })
      .route({ handler: () => '', method: 'GET', path: '/pigs/list' });
  } catch (error) {
    expect(error.message).toBe('Duplicated {GET /pigs/list} http route');

    done();
  }
});

it('should thrown an Error if duplicate routes are detected (parameter + optional parameter)', done => {
  try {
    new HttpRouter()
      .route({ handler: () => '', method: 'GET', path: '/pigs/:id' })
      .route({ handler: () => '', method: 'GET', path: '/pigs/:name?' });
  } catch (error) {
    expect(error.message).toBe('Duplicated {GET /pigs/:name?} http route');

    done();
  }
});

it('should thrown an Error if duplicate routes are detected (optional parameter + parameter)', done => {
  try {
    new HttpRouter()
      .route({ handler: () => '', method: 'GET', path: '/pigs/:name?' })
      .route({ handler: () => '', method: 'GET', path: '/pigs/:id' });
  } catch (error) {
    expect(error.message).toBe('Duplicated {GET /pigs/:id} http route');

    done();
  }
});
