import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { Body } from './route-param-body';
import { Request } from '../types/request';
import { Response } from '../types/response';

const body = { name: 'foo' };
const request: Partial<Request> = { body } as any;
const response: Partial<Response> = {} as any;

describe('@Body', () => {
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
        @Body() payload: any,
      ) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, Popcorn, 'getPigs');

    expect(routeParamMetadata.size).toEqual(1);
    expect(routeParamMetadata.get(0)(request as any, response as any)).toEqual(body);
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(
        @Body('age') age: number,
        @Body('name') name: string,
      ) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, Popcorn, 'getPigs');

    expect(routeParamMetadata.size).toEqual(2);
    expect(routeParamMetadata.get(0)(request as any, response as any)).toBeUndefined();
    expect(routeParamMetadata.get(1)(request as any, response as any)).toEqual(body.name);
  });
});
