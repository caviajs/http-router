import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { headersRouteParamDecoratorFactory, Headers } from './route-param-headers';
import { ExecutionContext } from '../types/execution-context';

describe('headersRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    const headers = { name: 'foo' };

    const executionContext: Partial<ExecutionContext> = {
      getRequest: () => ({ headers } as any),
    };

    expect(headersRouteParamDecoratorFactory(undefined, executionContext as any)).toEqual(headers);
    expect(headersRouteParamDecoratorFactory('name', executionContext as any)).toEqual(headers.name);
    expect(headersRouteParamDecoratorFactory('age', executionContext as any)).toBeUndefined();
  });
});

describe('@Headers', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      getPigs(@Headers() payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: undefined,
        factory: headersRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(@Headers('name') name: string, @Headers('age') age: string) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: 'age',
        factory: headersRouteParamDecoratorFactory,
        index: 1,
      },
      {
        data: 'name',
        factory: headersRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
