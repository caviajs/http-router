import { Http } from '@caviajs/common';
import { HttpClient, Options } from './http-client';

const url: string = 'https://caviajs.com/api';
const body: any = { foo: 'bar' };
const options: Options = {
  headers: { 'X-Foo': 'Foo' },
  params: { foo: 'bar' },
  timeout: 15000,
};

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let httpRequestSpy: jest.SpyInstance;

  beforeEach(() => {
    httpClient = new HttpClient();
    httpRequestSpy = jest.spyOn(Http, 'request').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delete', () => {
    describe('buffer', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.delete(url, { ...options, responseType: 'buffer' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, responseType: 'buffer', method: 'DELETE', url: url });
      });
    });

    describe('json', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.delete(url, { ...options, responseType: 'json' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, responseType: 'json', method: 'DELETE', url: url });
      });
    });

    describe('stream', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.delete(url, { ...options, responseType: 'stream' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, responseType: 'stream', method: 'DELETE', url: url });
      });
    });

    describe('text', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.delete(url, { ...options, responseType: 'text' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, responseType: 'text', method: 'DELETE', url: url });
      });
    });
  });

  describe('get', () => {
    describe('buffer', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.get(url, { ...options, responseType: 'buffer' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, responseType: 'buffer', method: 'GET', url: url });
      });
    });

    describe('json', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.get(url, { ...options, responseType: 'json' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, responseType: 'json', method: 'GET', url: url });
      });
    });

    describe('stream', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.get(url, { ...options, responseType: 'stream' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, responseType: 'stream', method: 'GET', url: url });
      });
    });

    describe('text', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.get(url, { ...options, responseType: 'text' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, responseType: 'text', method: 'GET', url: url });
      });
    });
  });

  describe('patch', () => {
    describe('buffer', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.patch(url, body, { ...options, responseType: 'buffer' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'buffer', method: 'PATCH', url: url });
      });
    });

    describe('json', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.patch(url, body, { ...options, responseType: 'json' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'json', method: 'PATCH', url: url });
      });
    });

    describe('stream', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.patch(url, body, { ...options, responseType: 'stream' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'stream', method: 'PATCH', url: url });
      });
    });

    describe('text', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.patch(url, body, { ...options, responseType: 'text' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'text', method: 'PATCH', url: url });
      });
    });
  });

  describe('post', () => {
    describe('buffer', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.post(url, body, { ...options, responseType: 'buffer' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'buffer', method: 'POST', url: url });
      });
    });

    describe('json', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.post(url, body, { ...options, responseType: 'json' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'json', method: 'POST', url: url });
      });
    });

    describe('stream', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.post(url, body, { ...options, responseType: 'stream' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'stream', method: 'POST', url: url });
      });
    });

    describe('text', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.post(url, body, { ...options, responseType: 'text' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'text', method: 'POST', url: url });
      });
    });
  });

  describe('put', () => {
    describe('buffer', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.put(url, body, { ...options, responseType: 'buffer' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'buffer', method: 'PUT', url: url });
      });
    });

    describe('json', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.put(url, body, { ...options, responseType: 'json' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'json', method: 'PUT', url: url });
      });
    });

    describe('stream', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.put(url, body, { ...options, responseType: 'stream' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'stream', method: 'PUT', url: url });
      });
    });

    describe('text', () => {
      it('should execute the request with the correct options', async () => {
        await httpClient.put(url, body, { ...options, responseType: 'text' });

        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...options, body: body, responseType: 'text', method: 'PUT', url: url });
      });
    });
  });
});
