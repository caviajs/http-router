import { Http } from '@caviajs/common';
import { HttpServerTest, HttpOptions, HttpResponse } from './http-server-test';
import http from 'http';
import net from 'net';

const method = 'POST';
const url: string = 'api/users';
const httpOptions: HttpOptions = {
  body: { foo: 'bar' },
  headers: { 'X-Foo': 'Foo' },
  params: { foo: 'bar' },
  timeout: 12500,
};
const httpResponse: HttpResponse<undefined> = {
  body: undefined,
  headers: {},
  statusCode: 200,
  statusMessage: 'OK',
};

const httpServerPort: number = 4200;
const httpServerProtocol: string = 'http';
const httpServerUrl: string = `${ httpServerProtocol }://127.0.0.1:${ httpServerPort }`;

describe('HttpServerTest', () => {
  let httpRequestSpy: jest.SpyInstance;
  let httpServer: http.Server;

  beforeEach(() => {
    httpRequestSpy = jest.spyOn(Http, 'request').mockReturnValue(Promise.resolve(httpResponse));
    httpServer = http.createServer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('request', () => {
    it('should execute http.Server.close after request', async () => {
      const httpServerCloseSpy: jest.SpyInstance = jest.spyOn(http.Server.prototype, 'close').mockImplementation(jest.fn());

      await HttpServerTest.request(httpServer, method, url, httpOptions);

      expect(httpServerCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('should execute http.Server.listen if the http.Server.address return null', async () => {
      jest.spyOn(http.Server.prototype, 'address').mockReturnValue(null);

      const httpServerListenSpy: jest.SpyInstance = jest.spyOn(http.Server.prototype, 'listen').mockImplementation(jest.fn());

      await HttpServerTest.request(httpServer, method, url, httpOptions);

      expect(httpServerListenSpy).toHaveBeenCalledTimes(1);
    });

    it('should not execute http.Server.listen if the http.Server.address return address info', async () => {
      jest.spyOn(http.Server.prototype, 'address').mockReturnValue({ port: httpServerPort } as net.AddressInfo);

      const httpServerListenSpy: jest.SpyInstance = jest.spyOn(http.Server.prototype, 'listen').mockImplementation(jest.fn());

      await HttpServerTest.request(httpServer, method, url, httpOptions);

      expect(httpServerListenSpy).toHaveBeenCalledTimes(0);
    });

    describe('without response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(httpServer, method, url, httpOptions);

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          method: method,
          url: `${ httpServerUrl }/${ url }`,
        });
      });
    });

    describe('buffer response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(httpServer, method, url, { ...httpOptions, responseType: 'buffer' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          responseType: 'buffer',
          method: method,
          url: `${ httpServerUrl }/${ url }`,
        });
      });
    });

    describe('json response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(httpServer, method, url, { ...httpOptions, responseType: 'json' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          responseType: 'json',
          method: method,
          url: `${ httpServerUrl }/${ url }`,
        });
      });
    });

    describe('stream response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(httpServer, method, url, { ...httpOptions, responseType: 'stream' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          responseType: 'stream',
          method: method,
          url: `${ httpServerUrl }/${ url }`,
        });
      });
    });

    describe('text response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(httpServer, method, url, { ...httpOptions, responseType: 'text' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          responseType: 'text',
          method: method,
          url: `${ httpServerUrl }/${ url }`,
        });
      });
    });
  });
});
