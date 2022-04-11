import { ROUTE_MAPPING_METADATA, RouteMapping, RouteMappingMetadata, RouteMappingOptions } from './route-mapping';

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

    const routeMappingMetadata: RouteMappingMetadata = { method: 'GET', path: '/pigs', schema: undefined };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with options', () => {
    const options: RouteMappingOptions = {
      schema: {
        requestBody: {},
      },
    };

    class Popcorn {
      @RouteMapping('GET', '/pigs', options)
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'GET', path: '/pigs', schema: options.schema };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });
});
