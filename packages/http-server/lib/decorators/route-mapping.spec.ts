import {
  ROUTE_MAPPING_METHOD_METADATA,
  ROUTE_MAPPING_PATH_METADATA,
  RouteMapping,
  Delete,
  Get,
  Head,
  Options,
  Patch,
  Post,
  Put,
} from './route-mapping';

describe('route mapping', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('@RouteMapping', () => {
    it('should add the appropriate metadata while using decorator', () => {
      class Popcorn {
        @RouteMapping('GET', '/pigs')
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'GET', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs'], Popcorn, 'getPigs');
    });
  });

  describe('@Delete', () => {
    it('should add the appropriate metadata while using decorator without arguments', () => {
      class Popcorn {
        @Delete()
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'DELETE', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with path', () => {
      class Popcorn {
        @Delete('/pigs')
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'DELETE', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with multiple paths', () => {
      class Foo {
        @Delete(['/pigs', 'guinea-pigs'])
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'DELETE', Foo, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs', 'guinea-pigs'], Foo, 'getPigs');
    });
  });

  describe('@Get', () => {
    it('should add the appropriate metadata while using decorator without arguments', () => {
      class Popcorn {
        @Get()
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'GET', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with path', () => {
      class Popcorn {
        @Get('/pigs')
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'GET', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with multiple paths', () => {
      class Foo {
        @Get(['/pigs', 'guinea-pigs'])
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'GET', Foo, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs', 'guinea-pigs'], Foo, 'getPigs');
    });
  });

  describe('@Head', () => {
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

  describe('@Options', () => {
    it('should add the appropriate metadata while using decorator without arguments', () => {
      class Popcorn {
        @Options()
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'OPTIONS', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with path', () => {
      class Popcorn {
        @Options('/pigs')
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'OPTIONS', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with multiple paths', () => {
      class Foo {
        @Options(['/pigs', 'guinea-pigs'])
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'OPTIONS', Foo, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs', 'guinea-pigs'], Foo, 'getPigs');
    });
  });

  describe('@Patch', () => {
    it('should add the appropriate metadata while using decorator without arguments', () => {
      class Popcorn {
        @Patch()
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'PATCH', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with path', () => {
      class Popcorn {
        @Patch('/pigs')
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'PATCH', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with multiple paths', () => {
      class Foo {
        @Patch(['/pigs', 'guinea-pigs'])
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'PATCH', Foo, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs', 'guinea-pigs'], Foo, 'getPigs');
    });
  });

  describe('@Post', () => {
    it('should add the appropriate metadata while using decorator without arguments', () => {
      class Popcorn {
        @Post()
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'POST', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with path', () => {
      class Popcorn {
        @Post('/pigs')
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'POST', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with multiple paths', () => {
      class Foo {
        @Post(['/pigs', 'guinea-pigs'])
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'POST', Foo, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs', 'guinea-pigs'], Foo, 'getPigs');
    });
  });

  describe('@Put', () => {
    it('should add the appropriate metadata while using decorator without arguments', () => {
      class Popcorn {
        @Put()
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'PUT', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with path', () => {
      class Popcorn {
        @Put('/pigs')
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'PUT', Popcorn, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs'], Popcorn, 'getPigs');
    });

    it('should add the appropriate metadata while using decorator with multiple paths', () => {
      class Foo {
        @Put(['/pigs', 'guinea-pigs'])
        getPigs() {
        }
      }

      expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_METHOD_METADATA, 'PUT', Foo, 'getPigs');
      expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_MAPPING_PATH_METADATA, ['/pigs', 'guinea-pigs'], Foo, 'getPigs');
    });
  });
});
