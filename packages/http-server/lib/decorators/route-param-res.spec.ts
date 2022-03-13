import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { resRouteParamDecoratorFactory, Res } from './route-param-res';
import { ExecutionContext } from '../types/execution-context';
import { Response } from '../types/response';

describe('resRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    const response: Partial<Response> = { headers: { name: 'foo' } } as any;

    const executionContext: Partial<ExecutionContext> = {
      getResponse: () => response as any,
    };

    expect(resRouteParamDecoratorFactory(undefined, executionContext as any)).toEqual(response);
    expect(resRouteParamDecoratorFactory('name', executionContext as any)).toEqual(response);
    expect(resRouteParamDecoratorFactory('age', executionContext as any)).toEqual(response);
  });
});

describe('@Res', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      getPigs(@Res() payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: undefined,
        factory: resRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(@Res('name') name: string, @Res('age') age: string) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: 'age',
        factory: resRouteParamDecoratorFactory,
        index: 1,
      },
      {
        data: 'name',
        factory: resRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
