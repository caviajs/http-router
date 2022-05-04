import { HttpServerRouter } from './http-server-router';
import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Injector } from '../injector';
import { Endpoint } from '../types/endpoint';

@Injectable()
export class HttpServerExplorer implements OnApplicationBoot {
  constructor(
    protected readonly httpServerRegistry: HttpServerRouter,
    protected readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const endpoints: Endpoint[] = await this
      .injector
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Endpoint);

    endpoints
      .map((endpoint: Endpoint) => {
        this.httpServerRegistry.declareEndpoint(endpoint);
      });
  }
}
