import { ROUTE_PARAM_METADATA, createRouteParamDecorator, RouteParamMetadata, RouteParamDecoratorFactory } from './route-param';
import { ExecutionContext } from '../types/execution-context';

const exampleFactory: RouteParamDecoratorFactory = (data: unknown, context: ExecutionContext) => {
  return context.getRequest();
};

describe('createRouteParamDecorator', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      getPigs(@createRouteParamDecorator(exampleFactory)() payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: undefined,
        factory: exampleFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with arguments', () => {
    class Popcorn {
      getPigs(@createRouteParamDecorator(exampleFactory)('name') name: string, @createRouteParamDecorator(exampleFactory)('age') age: string) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = [
      {
        data: 'age',
        factory: exampleFactory,
        index: 1,
      },
      {
        data: 'name',
        factory: exampleFactory,
        index: 0,
      },
    ];

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
