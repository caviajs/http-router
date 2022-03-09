import {
  bodyRouteParamDecoratorFactory,
  cookiesRouteParamDecoratorFactory,
  headersRouteParamDecoratorFactory,
  paramsRouteParamDecoratorFactory,
  queryRouteParamDecoratorFactory,
  reqRouteParamDecoratorFactory,
  resRouteParamDecoratorFactory,
} from './route-param';
import { ExecutionContext } from '../types/execution-context';

const body = { name: 'foo' };
const cookies = { auth: 'token' };
const headers = { authorization: 'Bearer token' };
const params = { id: '1245' };
const query = { email: 'popcorn@caviajs.com' };

const request = { body, cookies, headers, params, query };
const response = { headers: { 'Content-Type': 'application/json' } };

const context: Partial<ExecutionContext> = {
  getRequest: () => (request as any),
  getResponse: () => (response as any),
};

describe('bodyRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    expect(bodyRouteParamDecoratorFactory(undefined, context as any)).toEqual(body);
    expect(bodyRouteParamDecoratorFactory('name', context as any)).toEqual(body.name);
    expect(bodyRouteParamDecoratorFactory('age', context as any)).toBeUndefined();
  });
});

describe('cookiesRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    expect(cookiesRouteParamDecoratorFactory(undefined, context as any)).toEqual(cookies);
    expect(cookiesRouteParamDecoratorFactory('auth', context as any)).toEqual(cookies.auth);
    expect(cookiesRouteParamDecoratorFactory('foo', context as any)).toBeUndefined();
  });
});

describe('headersRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    expect(headersRouteParamDecoratorFactory(undefined, context as any)).toEqual(headers);
    expect(headersRouteParamDecoratorFactory('authorization', context as any)).toEqual(headers.authorization);
    expect(headersRouteParamDecoratorFactory('request-id', context as any)).toBeUndefined();
  });
});

describe('paramsRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    expect(paramsRouteParamDecoratorFactory(undefined, context as any)).toEqual(params);
    expect(paramsRouteParamDecoratorFactory('id', context as any)).toEqual(params.id);
    expect(paramsRouteParamDecoratorFactory('name', context as any)).toBeUndefined();
  });
});

describe('queryRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    expect(queryRouteParamDecoratorFactory(undefined, context as any)).toEqual(query);
    expect(queryRouteParamDecoratorFactory('email', context as any)).toEqual(query.email);
    expect(queryRouteParamDecoratorFactory('name', context as any)).toBeUndefined();
  });
});

describe('reqRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    expect(reqRouteParamDecoratorFactory(undefined, context as any)).toEqual(request);
    expect(reqRouteParamDecoratorFactory('foo', context as any)).toEqual(request);
  });
});

describe('resRouteParamDecoratorFactory', () => {
  expect(resRouteParamDecoratorFactory(undefined, context as any)).toEqual(response);
  expect(resRouteParamDecoratorFactory('foo', context as any)).toEqual(response);
});

describe('Body', () => {
});

describe('Cookies', () => {
});

describe('Headers', () => {
});

describe('Params', () => {
});

describe('Query', () => {
});

describe('Req', () => {
});

describe('Res', () => {
});

describe('createRouteParamDecorator', () => {
});
