import { HttpClient, HttpOptions, HttpResponse } from './http-client';

const url: string = 'https://caviajs.com/api';
const body: any = { foo: 'bar' };
const httpOptions: Partial<HttpOptions> = {
  headers: { 'X-Foo': 'Foo' },
  params: { foo: 'bar' },
  timeout: 15000,
};
const httpResponse: HttpResponse<undefined> = {
  body: undefined,
  headers: {},
  statusCode: 200,
  statusMessage: 'OK',
};

class HttpClientTest extends HttpClient {
  public request(options): any {
    return super.request(options);
  }
}

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let httpRequestSpy: jest.SpyInstance;

  beforeEach(() => {
    httpClient = new HttpClientTest();
    httpRequestSpy = jest.spyOn(HttpClientTest.prototype, 'request').mockReturnValue(Promise.resolve(httpResponse));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delete', () => {
    describe('without response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.delete(url, httpOptions);

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, method: 'DELETE', url: url });
      });
    });

    describe('buffer response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.delete(url, { ...httpOptions, responseType: 'buffer' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, responseType: 'buffer', method: 'DELETE', url: url });
      });
    });

    describe('json response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.delete(url, { ...httpOptions, responseType: 'json' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, responseType: 'json', method: 'DELETE', url: url });
      });
    });

    describe('stream response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.delete(url, { ...httpOptions, responseType: 'stream' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, responseType: 'stream', method: 'DELETE', url: url });
      });
    });

    describe('text response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.delete(url, { ...httpOptions, responseType: 'text' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, responseType: 'text', method: 'DELETE', url: url });
      });
    });
  });

  describe('get', () => {
    describe('without response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.get(url, httpOptions);

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, method: 'GET', url: url });
      });
    });

    describe('buffer response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.get(url, { ...httpOptions, responseType: 'buffer' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, responseType: 'buffer', method: 'GET', url: url });
      });
    });

    describe('json response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.get(url, { ...httpOptions, responseType: 'json' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, responseType: 'json', method: 'GET', url: url });
      });
    });

    describe('stream response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.get(url, { ...httpOptions, responseType: 'stream' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, responseType: 'stream', method: 'GET', url: url });
      });
    });

    describe('text response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.get(url, { ...httpOptions, responseType: 'text' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, responseType: 'text', method: 'GET', url: url });
      });
    });
  });

  describe('patch', () => {
    describe('without response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.patch(url, body, httpOptions);

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, method: 'PATCH', url: url });
      });
    });

    describe('buffer response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.patch(url, body, { ...httpOptions, responseType: 'buffer' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'buffer', method: 'PATCH', url: url });
      });
    });

    describe('json response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.patch(url, body, { ...httpOptions, responseType: 'json' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'json', method: 'PATCH', url: url });
      });
    });

    describe('stream response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.patch(url, body, { ...httpOptions, responseType: 'stream' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'stream', method: 'PATCH', url: url });
      });
    });

    describe('text response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.patch(url, body, { ...httpOptions, responseType: 'text' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'text', method: 'PATCH', url: url });
      });
    });
  });

  describe('post', () => {
    describe('without response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.post(url, body, httpOptions);

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, method: 'POST', url: url });
      });
    });

    describe('buffer response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.post(url, body, { ...httpOptions, responseType: 'buffer' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'buffer', method: 'POST', url: url });
      });
    });

    describe('json response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.post(url, body, { ...httpOptions, responseType: 'json' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'json', method: 'POST', url: url });
      });
    });

    describe('stream response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.post(url, body, { ...httpOptions, responseType: 'stream' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'stream', method: 'POST', url: url });
      });
    });

    describe('text response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.post(url, body, { ...httpOptions, responseType: 'text' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'text', method: 'POST', url: url });
      });
    });
  });

  describe('put', () => {
    describe('without response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.put(url, body, httpOptions);

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, method: 'PUT', url: url });
      });
    });

    describe('buffer response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.put(url, body, { ...httpOptions, responseType: 'buffer' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'buffer', method: 'PUT', url: url });
      });
    });

    describe('json response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.put(url, body, { ...httpOptions, responseType: 'json' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'json', method: 'PUT', url: url });
      });
    });

    describe('stream response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.put(url, body, { ...httpOptions, responseType: 'stream' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'stream', method: 'PUT', url: url });
      });
    });

    describe('text response type', () => {
      it('should execute Http.request with the correct options and return appropriate data', async () => {
        const response = await httpClient.put(url, body, { ...httpOptions, responseType: 'text' });

        expect(response).toEqual(httpResponse);
        expect(httpRequestSpy).toHaveBeenNthCalledWith(1, { ...httpOptions, body: body, responseType: 'text', method: 'PUT', url: url });
      });
    });
  });

  describe('request', () => {
    // todo
  });
});
