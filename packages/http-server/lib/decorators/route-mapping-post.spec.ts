import { ROUTE_MAPPING_METHOD_METADATA, ROUTE_MAPPING_PATH_METADATA } from './route-mapping';
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

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'POST', Popcorn, 'getPigs');
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, '/', Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    class Popcorn {
      @Post('/pigs')
      getPigs() {
      }
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'POST', Popcorn, 'getPigs');
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, '/pigs', Popcorn, 'getPigs');
  });
});
