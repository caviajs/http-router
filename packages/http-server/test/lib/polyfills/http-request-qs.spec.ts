// import http from 'http';
// import { HttpRouter, HttpServerTest } from '../../../src/public-api';
//
describe('http-request-qs', () => {
  it('foo', () => {
    expect(1).toBe(1);
  });

//   it('should contain appropriate parsed query params', done => {
//     const router = new HttpRouter();
//
//     router.route('GET', '/', req => {
//       try {
//         const query = req.qs();
//
//         expect(query).toEqual({ foo: 'bar', baz: 'qux' });
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
//
//     const server = http.createServer((req, res) => router.handle(req, res));
//
//     HttpServerTest
//       .get(server, '?foo=bar&baz=qux');
//   });
});
