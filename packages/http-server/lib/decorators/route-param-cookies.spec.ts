import { ROUTE_PARAM_METADATA, RouteParamMetadata } from './route-param';
import { cookiesRouteParamDecoratorFactory, Cookies } from './route-param-cookies';
import { ExecutionContext } from '../types/execution-context';

describe('bodyRouteParamDecoratorFactory', () => {
  it('should return the appropriate data', () => {
    const cookies = { name: 'foo' };

    const executionContext: Partial<ExecutionContext> = {
      getRequest: () => ({ cookies } as any),
    };

    expect(cookiesRouteParamDecoratorFactory(undefined, executionContext as any)).toEqual(cookies);
    expect(cookiesRouteParamDecoratorFactory('name', executionContext as any)).toEqual(cookies.name);
    expect(cookiesRouteParamDecoratorFactory('age', executionContext as any)).toBeUndefined();
  });
});

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
      getPigs(@Cookies() payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: undefined,
        factory: cookiesRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(@Cookies('name') name: string, @Cookies('age') age: string) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: 'age',
        factory: cookiesRouteParamDecoratorFactory,
        index: 1,
      },
      {
        data: 'name',
        factory: cookiesRouteParamDecoratorFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
