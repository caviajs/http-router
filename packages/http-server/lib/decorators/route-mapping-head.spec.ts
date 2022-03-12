import { ROUTE_MAPPING_METHOD_METADATA, ROUTE_MAPPING_PATH_METADATA } from './route-mapping';
import { Head } from './route-mapping-head';

describe('@Head', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator without arguments', () => {
    class Popcorn {
      @Head()
      getPigs() {
      }
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'HEAD', Popcorn, 'getPigs');
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/'], Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with path', () => {
    class Popcorn {
      @Head('/pigs')
      getPigs() {
      }
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'HEAD', Popcorn, 'getPigs');
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs'], Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with multiple paths', () => {
    class Foo {
      @Head(['/pigs', 'guinea-pigs'])
      getPigs() {
      }
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'HEAD', Foo, 'getPigs');
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs', 'guinea-pigs'], Foo, 'getPigs');
  });
});
