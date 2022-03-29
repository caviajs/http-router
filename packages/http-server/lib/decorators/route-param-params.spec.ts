import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { Params } from './route-param-params';
import { Request } from '../types/request';
import { Response } from '../types/response';

const params = { name: 'foo' };
const request: Partial<Request> = { params } as any;
const response: Partial<Response> = {} as any;

describe('@Params', () => {
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
        @Params() payload: any,
      ) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, Popcorn, 'getPigs');

    expect(routeParamMetadata.size).toEqual(1);
    expect(routeParamMetadata.get(0)(request as any, response as any)).toEqual(params);
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(
        @Params('age') age: number,
        @Params('name') name: string,
      ) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, Popcorn, 'getPigs');

    expect(routeParamMetadata.size).toEqual(2);
    expect(routeParamMetadata.get(0)(request as any, response as any)).toBeUndefined();
    expect(routeParamMetadata.get(1)(request as any, response as any)).toEqual(params.name);
  });
});
