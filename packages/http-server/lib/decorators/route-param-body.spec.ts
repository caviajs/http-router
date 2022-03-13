import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { bodyRouteParamDecoratorFactory, Body } from './route-param-body';
import { ExecutionContext } from '../types/execution-context';

describe('bodyRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    const body = { name: 'foo' };

    const executionContext: Partial<ExecutionContext> = {
      getRequest: () => ({ body } as any),
    };

    expect(bodyRouteParamDecoratorFactory(undefined, executionContext as any)).toEqual(body);
    expect(bodyRouteParamDecoratorFactory('name', executionContext as any)).toEqual(body.name);
    expect(bodyRouteParamDecoratorFactory('age', executionContext as any)).toBeUndefined();
  });
});

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
      getPigs(@Body() payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: undefined,
        factory: bodyRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(@Body('name') name: string, @Body('age') age: string) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: 'age',
        factory: bodyRouteParamDecoratorFactory,
        index: 1,
      },
      {
        data: 'name',
        factory: bodyRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
