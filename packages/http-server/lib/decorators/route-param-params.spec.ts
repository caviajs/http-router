import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { paramsRouteParamDecoratorFactory, Params } from './route-param-params';
import { ExecutionContext } from '../types/execution-context';

describe('paramsRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    const headers = { name: 'foo' };

    const executionContext: Partial<ExecutionContext> = {
      getRequest: () => ({ headers } as any),
    };

    expect(paramsRouteParamDecoratorFactory(undefined, executionContext as any)).toEqual(headers);
    expect(paramsRouteParamDecoratorFactory('name', executionContext as any)).toEqual(headers.name);
    expect(paramsRouteParamDecoratorFactory('age', executionContext as any)).toBeUndefined();
  });
});

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
      getPigs(@Params() payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: undefined,
        factory: paramsRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(@Params('name') name: string, @Params('age') age: string) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: 'age',
        factory: paramsRouteParamDecoratorFactory,
        index: 1,
      },
      {
        data: 'name',
        factory: paramsRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
