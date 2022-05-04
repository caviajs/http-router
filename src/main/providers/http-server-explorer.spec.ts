import { HttpServerExplorer } from './http-server-explorer';
import { Injector } from '../injector';
import { Injectable } from '../decorators/injectable';
import { Endpoint, EndpointMetadata } from '../types/endpoint';
import { HttpServerRouter } from './http-server-router';

@Injectable()
class FooEndpoint extends Endpoint {
  public readonly metadata: EndpointMetadata = {
    path: '/foo',
    method: 'GET',
  };

  public handle(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

@Injectable()
class BarEndpoint extends Endpoint {
  public readonly metadata: EndpointMetadata = {
    path: '/bar',
    method: 'GET',
  };

  public handle(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

@Injectable()
class NoEndpoint {
}

describe('HttpServerExplorer', () => {
  const httpServerRegistryAdd = jest.fn();

  let httpServerExplorer: HttpServerExplorer;
  let fooEndpoint: FooEndpoint;
  let barEndpoint: BarEndpoint;
  let noEndpoint: NoEndpoint;

  beforeEach(async () => {
    const injector: Injector = await Injector.create([FooEndpoint, BarEndpoint, NoEndpoint]);
    const httpServerRegistry: Partial<HttpServerRouter> = {
      declareEndpoint: httpServerRegistryAdd,
    };

    httpServerExplorer = new HttpServerExplorer(httpServerRegistry as any, injector);
    fooEndpoint = await injector.find(FooEndpoint);
    barEndpoint = await injector.find(BarEndpoint);
    noEndpoint = await injector.find(NoEndpoint);
  });

  describe('onApplicationBoot', () => {
    it('should add endpoints', async () => {
      expect(httpServerRegistryAdd).toHaveBeenCalledTimes(0);

      await httpServerExplorer.onApplicationBoot();

      expect(httpServerRegistryAdd).toHaveBeenCalledTimes(2);
      expect(httpServerRegistryAdd).toHaveBeenCalledWith(fooEndpoint);
      expect(httpServerRegistryAdd).toHaveBeenCalledWith(barEndpoint);
    });
  });
});
