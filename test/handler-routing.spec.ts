import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../src';

function createServer(): http.Server {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({
      handler: (request, response) => {
        return 'GET /pigs';
      },
      method: 'GET',
      path: '/pigs',
    })
    .route({
      handler: (request, response) => {
        response.statusCode = 201;

        return 'POST /pigs';
      },
      method: 'POST',
      path: '/pigs',
    })
    .route({
      handler: (request, response) => {
        return `GET /pigs/${ request.params.id }`;
      },
      method: 'GET',
      path: '/pigs/:id',
    })
    .route({
      handler: (request, response) => {
        return `PUT /pigs/${ request.params.id }`;
      },
      method: 'PUT',
      path: '/pigs/:id',
    })
    .route({
      handler: (request, response) => {
        return `DELETE /pigs/${ request.params.id }`;
      },
      method: 'DELETE',
      path: '/pigs/:id',
    });

  return http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });
}

describe('Routing', () => {
  it('should thrown an Error if path does not start with /', () => {
    try {
      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .route({ handler: () => '', method: 'GET', path: 'pigs' });
    } catch (error) {
      expect(error.message).toBe(`The route path in 'GET pigs' should start with '/'`);
    }
  });

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

  it('should thrown an HttpException(404) for a non-existent route', (done) => {
    const httpServer: http.Server = createServer();

    supertest(httpServer)
      .get('/non-existent-route')
      .expect(404, { statusCode: 404, statusMessage: 'Route not found' }, done);
  });

  it('should execute the handler of the appropriate route', (done) => {
    const httpServer: http.Server = createServer();

    // GET /pigs
    supertest(httpServer)
      .get('/pigs')
      .expect(200, 'GET /pigs', done);

    // POST /pigs
    supertest(httpServer)
      .post('/pigs')
      .expect(201, 'POST /pigs', done);

    // GET /pigs/:id
    supertest(httpServer)
      .get('/pigs/1245')
      .expect(200, 'GET /pigs/1245', done);

    // PUT /pigs/:id
    supertest(httpServer)
      .put('/pigs/4578')
      .expect(200, 'PUT /pigs/4578', done);

    // DELETE /pigs/:id
    supertest(httpServer)
      .delete('/pigs/40')
      .expect(200, 'DELETE /pigs/40', done);
  });
});
