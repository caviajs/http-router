import { ROUTE_MAPPING_METADATA, RouteMappingMetadata } from './route-mapping';
import { Patch } from './route-mapping-patch';

describe('@Patch', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      @Patch()
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'PATCH', path: '/' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    class Popcorn {
      @Patch('/pigs')
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'PATCH', path: '/pigs' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });
});
