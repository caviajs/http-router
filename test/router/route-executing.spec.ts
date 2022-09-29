import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../../src';

it('should execute the handler of the appropriate route', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({ handler: () => 'DELETE /pigs/:id', method: 'DELETE', path: '/pigs/:id' })
    .route({ handler: () => 'GET /pigs', method: 'GET', path: '/pigs' })
    .route({ handler: () => 'GET /pigs/:id', method: 'GET', path: '/pigs/:id' })
    .route({ handler: () => 'PATCH /pigs/:id', method: 'PATCH', path: '/pigs/:id' })
    .route({ handler: () => 'POST /pigs', method: 'POST', path: '/pigs' })
    .route({ handler: () => 'PUT /pigs/:id', method: 'PUT', path: '/pigs/:id' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  // DELETE /pigs/:id
  await supertest(httpServer)
    .delete('/pigs/1')
    .expect(200, 'DELETE /pigs/:id');

  // GET /pigs
  await supertest(httpServer)
    .get('/pigs')
    .expect(200, 'GET /pigs');

  // GET /pigs/:id
  await supertest(httpServer)
    .get('/pigs/1')
    .expect(200, 'GET /pigs/:id');

  // PATCH /pigs/:id
  await supertest(httpServer)
    .patch('/pigs/1')
    .expect(200, 'PATCH /pigs/:id');

  // POST /pigs
  await supertest(httpServer)
    .post('/pigs')
    .expect(200, 'POST /pigs');

  // PUT /pigs/:id
  await supertest(httpServer)
    .put('/pigs/1')
    .expect(200, 'PUT /pigs/:id');
});

it('should execute the handler of the appropriate route (optional parameters)', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({ handler: () => 'GET /pigs/:id?', method: 'GET', path: '/pigs/:id?' });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .get('/pigs')
    .expect(200, 'GET /pigs/:id?');

  await supertest(httpServer)
    .get('/pigs/1')
    .expect(200, 'GET /pigs/:id?');
});
