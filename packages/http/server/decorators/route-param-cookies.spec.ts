import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { Cookies } from './route-param-cookies';
import { Request } from '../types/request';
import { Response } from '../types/response';

const cookies = { name: 'foo' };
const request: Partial<Request> = { cookies } as any;
const response: Partial<Response> = {} as any;

describe('@Cookies', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      getPigs(
        @Cookies() payload: any,
      ) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, Popcorn, 'getPigs');

    expect(routeParamMetadata.size).toEqual(1);
    expect(routeParamMetadata.get(0)(request as any, response as any)).toEqual(cookies);
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(
        @Cookies('age') age: number,
        @Cookies('name') name: string,
      ) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, Popcorn, 'getPigs');

    expect(routeParamMetadata.size).toEqual(2);
    expect(routeParamMetadata.get(0)(request as any, response as any)).toBeUndefined();
    expect(routeParamMetadata.get(1)(request as any, response as any)).toEqual(cookies.name);
  });
});
