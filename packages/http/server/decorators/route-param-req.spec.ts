import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { Req } from './route-param-req';
import { Request } from '../types/request';
import { Response } from '../types/response';

const request: Partial<Request> = {} as any;
const response: Partial<Response> = {} as any;

describe('@Req', () => {
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
        @Req() payload: any,
      ) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = Reflect.getMetadata(ROUTE_PARAM_METADATA, Popcorn, 'getPigs');

    expect(routeParamMetadata.size).toEqual(1);
    expect(routeParamMetadata.get(0)(request as any, response as any)).toEqual(request);
  });
});
