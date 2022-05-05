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

  describe('request', () => {
    it('should', () => {
      expect(1).toBe(1);
    });
  });
});
