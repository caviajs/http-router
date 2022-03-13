import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { reqRouteParamDecoratorFactory, Req } from './route-param-req';
import { ExecutionContext } from '../types/execution-context';
import { Request } from '../types/request';

describe('reqRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    const request: Partial<Request> = { params: { name: 'foo' } } as any;

    const executionContext: Partial<ExecutionContext> = {
      getRequest: () => request as any,
    };

    expect(reqRouteParamDecoratorFactory(undefined, executionContext as any)).toEqual(request);
    expect(reqRouteParamDecoratorFactory('name', executionContext as any)).toEqual(request);
    expect(reqRouteParamDecoratorFactory('age', executionContext as any)).toEqual(request);
  });
});

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
      getPigs(@Req() payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: undefined,
        factory: reqRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(@Req('name') name: string, @Req('age') age: string) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: 'age',
        factory: reqRouteParamDecoratorFactory,
        index: 1,
      },
      {
        data: 'name',
        factory: reqRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
