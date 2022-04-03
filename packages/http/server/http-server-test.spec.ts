import { Http } from '@caviajs/common';
import { Application, CaviaApplication, Test } from '@caviajs/core';
import { LoggerPackage } from '@caviajs/logger';
import http from 'http';
import net from 'net';
import { Method } from './types/method';
import { Path } from './types/path';
import { HttpServerPackage } from './http-server-package';
import { HttpServerTest, HttpOptions, HttpResponse } from './http-server-test';

@Application({
  packages: [
    HttpServerPackage.configure().register(),
    LoggerPackage.configure().register(),
  ],
})
class App {
}

const method: Method = 'POST';
const path: Path = 'api/users';
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
  let caviaApplication: CaviaApplication;
  let httpRequestSpy: jest.SpyInstance;

  beforeEach(async () => {
    caviaApplication = await Test.createTestingApplication(App).compile();
    httpRequestSpy = jest.spyOn(Http, 'request').mockReturnValue(Promise.resolve(httpResponse));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('request', () => {
    it('should execute http.Server.close after request', async () => {
      const httpServerCloseSpy: jest.SpyInstance = jest.spyOn(http.Server.prototype, 'close').mockImplementation(jest.fn());

      await HttpServerTest.request(caviaApplication, method, path, httpOptions);

      expect(httpServerCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('should execute http.Server.listen if the http.Server.address return null', async () => {
      jest.spyOn(http.Server.prototype, 'address').mockReturnValue(null);

      const httpServerListenSpy: jest.SpyInstance = jest.spyOn(http.Server.prototype, 'listen').mockImplementation(jest.fn());

      await HttpServerTest.request(caviaApplication, method, path, httpOptions);

      expect(httpServerListenSpy).toHaveBeenCalledTimes(1);
    });

    it('should not execute http.Server.listen if the http.Server.address return address info', async () => {
      jest.spyOn(http.Server.prototype, 'address').mockReturnValue({ port: httpServerPort } as net.AddressInfo);

      const httpServerListenSpy: jest.SpyInstance = jest.spyOn(http.Server.prototype, 'listen').mockImplementation(jest.fn());

      await HttpServerTest.request(caviaApplication, method, path, httpOptions);

      expect(httpServerListenSpy).toHaveBeenCalledTimes(0);
    });

    describe('without response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(caviaApplication, method, path, httpOptions);

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          method: method,
          url: `${ httpServerUrl }/${ path }`,
        });
      });
    });

    describe('buffer response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(caviaApplication, method, path, { ...httpOptions, responseType: 'buffer' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          responseType: 'buffer',
          method: method,
          url: `${ httpServerUrl }/${ path }`,
        });
      });
    });

    describe('json response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(caviaApplication, method, path, { ...httpOptions, responseType: 'json' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          responseType: 'json',
          method: method,
          url: `${ httpServerUrl }/${ path }`,
        });
      });
    });

    describe('stream response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(caviaApplication, method, path, { ...httpOptions, responseType: 'stream' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          responseType: 'stream',
          method: method,
          url: `${ httpServerUrl }/${ path }`,
        });
      });
    });

    describe('text response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await HttpServerTest.request(caviaApplication, method, path, { ...httpOptions, responseType: 'text' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, {
          ...httpOptions,
          responseType: 'text',
          method: method,
          url: `${ httpServerUrl }/${ path }`,
        });
      });
    });
  });
});
