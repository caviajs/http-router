import { ROUTE_MAPPING_METADATA, RouteMappingMetadata } from './route-mapping';
import { Post } from './route-mapping-post';

describe('@Post', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      @Post()
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'POST', path: '/' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    class Popcorn {
      @Post('/pigs')
      getPigs() {
      }
    }

    const routeMappingMetadata: RouteMappingMetadata = { method: 'POST', path: '/pigs' };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METADATA, routeMappingMetadata, Popcorn, 'getPigs');
  });
});
