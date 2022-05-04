import { HttpServerRouter } from './http-server-router';
import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Container } from '../container';
import { Endpoint } from '../types/endpoint';

@Injectable()
export class HttpServerExplorer implements OnApplicationBoot {
  constructor(
    protected readonly container: Container,
    protected readonly httpServerRegistry: HttpServerRouter,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const endpoints: Endpoint[] = await this
      .container
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Endpoint);

    endpoints
      .map((endpoint: Endpoint) => {
        this.httpServerRegistry.declareEndpoint(endpoint);
      });
  }
}
