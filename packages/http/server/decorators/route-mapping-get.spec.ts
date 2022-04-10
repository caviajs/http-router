import { ROUTE_MAPPING_METADATA, RouteMappingMetadata } from './route-mapping';
import { Get } from './route-mapping-get';

describe('@Get', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      @Get()
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'GET', path: '/' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    class Popcorn {
      @Get('/pigs')
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'GET', path: '/pigs' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });
});
