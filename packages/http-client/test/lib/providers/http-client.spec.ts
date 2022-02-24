import { HttpClient, RequestOptions, RequestResult } from '../../../src/public-api';

describe('HttpClient', () => {
  describe('http methods', () => {
    const url = '/hello';
    const options: Partial<RequestOptions> = {
      body: 'Foo',
      headers: { 'X-Foo': 'Foo' },
      params: { foo: 'bar' },
      responseType: 'json',
      timeout: 10000,
    };

    let httpClient: HttpClient;
    let httpClientRequestSpy: jest.SpyInstance;
    const httpClientRequestReturn: RequestResult<any> = {
      body: null,
      headers: { 'X-Bar': 'Bar' },
      statusCode: 200,
      statusMessage: 'OK',
    };

    beforeEach(() => {
      httpClient = new HttpClient();

      httpClientRequestSpy = jest
        .spyOn(HttpClient.prototype, 'request')
        .mockImplementation(() => Promise.resolve(httpClientRequestReturn));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should correct to execute the request method (delete)', async () => {
      const result = await httpClient.delete(url, options as any);

      expect(result).toEqual(httpClientRequestReturn);
      expect(httpClientRequestSpy).toHaveBeenCalledTimes(1);
      expect(httpClientRequestSpy).toHaveBeenCalledWith({ ...options, method: 'DELETE', url: url });
    });

    it('should correct to execute the request method (get)', async () => {
      const result = await httpClient.get(url, options as any);

      expect(result).toEqual(httpClientRequestReturn);
      expect(httpClientRequestSpy).toHaveBeenCalledTimes(1);
      expect(httpClientRequestSpy).toHaveBeenCalledWith({ ...options, method: 'GET', url: url });
    });

    it('should correct to execute the request method (patch)', async () => {
      const result = await httpClient.patch(url, options as any);

      expect(result).toEqual(httpClientRequestReturn);
      expect(httpClientRequestSpy).toHaveBeenCalledTimes(1);
      expect(httpClientRequestSpy).toHaveBeenCalledWith({ ...options, method: 'PATCH', url: url });
    });

    it('should correct to execute the request method (post)', async () => {
      const result = await httpClient.post(url, options as any);

      expect(result).toEqual(httpClientRequestReturn);
      expect(httpClientRequestSpy).toHaveBeenCalledTimes(1);
      expect(httpClientRequestSpy).toHaveBeenCalledWith({ ...options, method: 'POST', url: url });
    });

    it('should correct to execute the request method (put)', async () => {
      const result = await httpClient.put(url, options as any);

      expect(result).toEqual(httpClientRequestReturn);
      expect(httpClientRequestSpy).toHaveBeenCalledTimes(1);
      expect(httpClientRequestSpy).toHaveBeenCalledWith({ ...options, method: 'PUT', url: url });
    });
  });

  it('request method', () => {
  });

  describe('response types', () => {
    it('buffer', () => {
    });

    it('json', () => {
    });

    it('stream', () => {
    });

    it('text', () => {
    });
  });
});
