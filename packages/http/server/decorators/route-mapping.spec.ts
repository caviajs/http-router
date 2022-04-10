import { ROUTE_MAPPING_METADATA, RouteMapping, RouteMappingMetadata } from './route-mapping';

describe('@RouteMapping', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    class Popcorn {
      @RouteMapping('GET', '/pigs')
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'GET', path: '/pigs' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });
});
