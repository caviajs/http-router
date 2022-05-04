import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Method } from '../types/method';
import { Injectable } from '../decorators/injectable';
import { Logger } from './logger';
import { HTTP_CONTEXT } from '../constants';
import { Endpoint, EndpointMetadata } from '../types/endpoint';

@Injectable()
export class HttpServerRouter {
  protected readonly endpoints: Endpoint[] = [];

  public get apiSpec(): ApiSpec {
    return {
      endpoints: this.endpoints.map(endpoint => {
        return { name: endpoint.constructor.name, ...endpoint.metadata };
      }),
    };
  }

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public declareEndpoint(endpoint: Endpoint): void {
    if (!endpoint.metadata.path.startsWith('/')) {
      this.logger.fatal(`The path in '${ endpoint.constructor.name }' should start with '/'`, HTTP_CONTEXT);

      return process.exit(0);
    }

    // todo endpoint.metadata.schema validation

    const matcher = match(endpoint.metadata.path);

    if (this.endpoints.some(it => it.metadata.method === endpoint.metadata.method && matcher(it.metadata.path))) {
      this.logger.fatal(`Duplicated {${ endpoint.metadata.method } ${ endpoint.metadata.path }} http endpoint`, HTTP_CONTEXT);

      return process.exit(0);
    }

    this.endpoints.push(endpoint);
    this.logger.trace(`Mapped {${ endpoint.metadata.method } ${ endpoint.metadata.path }} http endpoint`, HTTP_CONTEXT);
  }

  public resolveEndpoint(method: Method, url: string): Endpoint | undefined {
    let endpoint: Endpoint | undefined;

    const pathname: string = parse(url).pathname;

    for (const it of this.endpoints.filter(r => r.metadata.method === method)) {
      if (match(it.metadata.path)(pathname)) {
        endpoint = it;
        break;
      }
    }

    return endpoint;
  }
}

export interface ApiSpec {
  endpoints: ({ name: string } & EndpointMetadata)[];
}
