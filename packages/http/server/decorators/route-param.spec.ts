import { ROUTE_PARAM_METADATA, RouteParamMetadata, RouteParamFactory, RouteParam } from './route-param';

const exampleFactory: RouteParamFactory = (request) => {
  return request;
};

describe('@RouteParam', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      getPigs(@RouteParam(exampleFactory) payload: any) {
      }
    }

    const routeParamMetadata: RouteParamMetadata = new Map().set(0, exampleFactory);

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(ROUTE_PARAM_METADATA, routeParamMetadata, Popcorn, 'getPigs');
  });
});
