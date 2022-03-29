import { ROUTE_MAPPING_METHOD_METADATA, ROUTE_MAPPING_PATH_METADATA } from './route-mapping';
import { Delete } from './route-mapping-delete';

describe('@Delete', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      @Delete()
      getPigs() {
      }
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'DELETE', Popcorn, 'getPigs');
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, '/', Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    class Popcorn {
      @Delete('/pigs')
      getPigs() {
      }
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'DELETE', Popcorn, 'getPigs');
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, '/pigs', Popcorn, 'getPigs');
  });
});
