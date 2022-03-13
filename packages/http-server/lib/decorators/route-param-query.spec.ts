import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { queryRouteParamDecoratorFactory, Query } from './route-param-query';
import { ExecutionContext } from '../types/execution-context';

describe('queryRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    const query = { name: 'foo' };

    const executionContext: Partial<ExecutionContext> = {
      getRequest: () => ({ query } as any),
    };

    expect(queryRouteParamDecoratorFactory(undefined, executionContext as any)).toEqual(query);
    expect(queryRouteParamDecoratorFactory('name', executionContext as any)).toEqual(query.name);
    expect(queryRouteParamDecoratorFactory('age', executionContext as any)).toBeUndefined();
  });
});

describe('@Query', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      getPigs(@Query() payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: undefined,
        factory: queryRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(@Query('name') name: string, @Query('age') age: string) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: 'age',
        factory: queryRouteParamDecoratorFactory,
        index: 1,
      },
      {
        data: 'name',
        factory: queryRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
