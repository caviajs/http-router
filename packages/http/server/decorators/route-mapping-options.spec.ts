import { ROUTE_MAPPING_METADATA, RouteMappingMetadata } from './route-mapping';
import { Options } from './route-mapping-options';

describe('@Options', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      @Options()
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'OPTIONS', path: '/' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    class Popcorn {
      @Options('/pigs')
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'OPTIONS', path: '/pigs' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });
});
