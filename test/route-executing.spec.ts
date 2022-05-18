import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../src';

it('should execute the handler of the appropriate route', (done) => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({ handler: () => 'GET /pigs', method: 'GET', path: '/pigs' })
    .route({ handler: () => 'POST /pigs', method: 'POST', path: '/pigs' })
    .route({ handler: (request) => `GET /pigs/${ request.params.id }`, method: 'GET', path: '/pigs/:id' })
    .route({ handler: (request) => `PUT /pigs/${ request.params.id }`, method: 'PUT', path: '/pigs/:id' })
    .route({ handler: (request) => `DELETE /pigs/${ request.params.id }`, method: 'DELETE', path: '/pigs/:id' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  // GET /pigs
  supertest(httpServer)
    .get('/pigs')
    .expect(200, 'GET /pigs', done);

  // POST /pigs
  supertest(httpServer)
    .post('/pigs')
    .expect(200, 'POST /pigs', done);

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
