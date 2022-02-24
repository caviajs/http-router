// import http from 'http';
// import { HttpRouter, HttpServerTest } from '../../../src/public-api';
//
// describe('http-request-body', () => {
//   // limits
//   // defalte, gzip, Unsupported content encoding
//
//   // describe('Unsupported Media Type', () => {
//   //   it('should throw error for unsupported media type', done => {
//   //     const router = new HttpRouter();
//   //
//   //     router.route('POST', '/', async req => {
//   //       try {
//   //         const body = await req.body('image/png');
//   //
//   //         expect(body).toEqual({ hello: 'world' });
//   //         expect(typeof body).toBe('object');
//   //
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   //
//   //     const server = http
//   //       .createServer((req, res) => router.handle(req, res));
//   //
//   //     HttpServerTest
//   //       .post(server, '/', {
//   //         headers: {
//   //           'Content-Type': 'image/png',
//   //         },
//   //       });
//   //   });
//   // });
//
//   describe('Supported Media Type', () => {
//     it('application/json', done => {
//       const router = new HttpRouter();
//
//       router.route('POST', '/', async req => {
//         try {
//           const body = await req.body();
//
//           expect(body).toEqual({ bar: 'baz' });
//           expect(typeof body).toBe('object');
//
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//
//       const server = http
//         .createServer((req, res) => router.handle(req, res));
//
//       HttpServerTest
//         .post(server, '/', {
//           body: { bar: 'baz' },
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//     });
//
//     it('application/x-www-form-urlencoded', done => {
//       const router = new HttpRouter();
//
//       router.route('POST', '/', async req => {
//         try {
//           const body = await req.body();
//
//           expect(body).toEqual({ foo: 'foz', bar: 'baz' });
//           expect(typeof body).toBe('object');
//
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//
//       const server = http
//         .createServer((req, res) => router.handle(req, res));
//
//       HttpServerTest
//         .post(server, '/', {
//           body: 'foo=foz&bar=baz',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         });
//     });
//
//     it('multipart/form-data', done => {
//       const boundary = '----WebKitFormBoundaryvef1fLxmoUdYZWXp';
//
//       let rawBody = 'trash1\r\n';
//       rawBody += `--${ boundary }\r\n`;
//       rawBody += 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"\r\n';
//       rawBody += 'Content-Type: text/plain\r\n';
//       rawBody += '\r\n';
//       rawBody += '@11X';
//       rawBody += '111Y\r\n';
//       rawBody += '111Z\rCCCC\nCCCC\r\nCCCCC@\r\n\r\n';
//       rawBody += `--${ boundary }\r\n`;
//       rawBody += 'Content-Disposition: form-data; name="uploads[]"; filename="B.txt"\r\n';
//       rawBody += 'Content-Type: text/plain\r\n';
//       rawBody += '\r\n';
//       rawBody += '@22X';
//       rawBody += '222Y\r\n';
//       rawBody += '222Z\r222W\n2220\r\n666@\r\n';
//       rawBody += `--${ boundary }\r\n`;
//       rawBody += 'Content-Disposition: form-data; name="input1"\r\n';
//       rawBody += '\r\n';
//       rawBody += 'value1\r\n';
//       rawBody += `--${ boundary }--\r\n`;
//
//       const router = new HttpRouter();
//
//       router.route('POST', '/', async req => {
//         try {
//           const body = await req.body();
//
//           expect(body).toEqual([
//             {
//               buffer: Buffer.from('@11X111Y\r\n111Z\rCCCC\nCCCC\r\nCCCCC@\r\n'),
//               headers: [
//                 'Content-Disposition: form-data; name=\"uploads[]\"; filename=\"A.txt\"',
//                 'Content-Type: text/plain',
//               ],
//             },
//             {
//               buffer: Buffer.from('@22X222Y\r\n222Z\r222W\n2220\r\n666@'),
//               headers: [
//                 'Content-Disposition: form-data; name=\"uploads[]\"; filename=\"B.txt\"',
//                 'Content-Type: text/plain',
//               ],
//             },
//             {
//               buffer: Buffer.from('value1'),
//               headers: [
//                 'Content-Disposition: form-data; name=\"input1\"',
//               ],
//             },
//           ]);
//           expect(typeof body).toBe('object');
//
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//
//       const server = http
//         .createServer((req, res) => router.handle(req, res));
//
//       HttpServerTest
//         .post(server, '/', {
//           body: Buffer.from(rawBody),
//           headers: {
//             'Content-Type': `multipart/form-data; boundary=${ boundary }`,
//           },
//         });
//     });
//
//     it('text/plain', done => {
//       const router = new HttpRouter();
//
//       router.route('POST', '/', async req => {
//         try {
//           const body = await req.body();
//
//           expect(body).toBe('Hello World');
//           expect(typeof body).toBe('string');
//
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//
//       const server = http
//         .createServer((req, res) => router.handle(req, res));
//
//       HttpServerTest
//         .post(server, '/', {
//           body: 'Hello World',
//           headers: {
//             'Content-Type': 'text/plain',
//           },
//         });
//     });
//   });
// });
