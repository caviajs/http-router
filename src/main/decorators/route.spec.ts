import { ROUTE_METADATA, Route, RouteMetadata, RouteSchema } from './route';

describe('@Route', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    class Popcorn {
      @Route('GET', '/pigs')
      getPigs() {
      }
    }

    const routeMetadata: RouteMetadata = { method: 'GET', path: '/pigs', schema: undefined };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_METADATA, routeMetadata, Popcorn, 'getPigs');
  });

  it('should add the appropriate metadata while using decorator with schema', () => {
    const schema: RouteSchema = {
      request: {
        body: {
          type: 'string',
        },
      },
    };

    class Popcorn {
      @Route('GET', '/pigs', schema)
      getPigs() {
      }
    }

    const routeMetadata: RouteMetadata = { method: 'GET', path: '/pigs', schema: schema };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ROUTE_METADATA, routeMetadata, Popcorn, 'getPigs');
  });
});
