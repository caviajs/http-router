// import http from 'http';
// import { HttpRouter, HttpServerTest } from '../../../src/public-api';
//
describe('http-request-cookies', () => {
  it('foo', () => {
    expect(1).toBe(1);
  });

//   it('should contain appropriate parsed cookies', done => {
//     const router = new HttpRouter();
//
//     router.route('GET', '/', req => {
//       try {
//         const cookies = req.cookies();
//
//         expect(cookies.foo).toBe('bar');
//         expect(cookies.baz).toBe('qux');
//
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
//
//     const server = http
//       .createServer((req, res) => router.handle(req, res));
//
//     HttpServerTest
//       .get(server, '/', { headers: { Cookie: 'foo=bar; baz=qux' } });
//   });
});
