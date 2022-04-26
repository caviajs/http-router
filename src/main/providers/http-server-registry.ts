import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Method } from '../types/method';
import { Injectable } from '../decorators/injectable';
import { Logger } from './logger';
import { HTTP_CONTEXT } from '../constants';
import { Endpoint, EndpointMetadata } from '../types/endpoint';

@Injectable()
export class HttpServerRegistry {
  protected readonly endpoints: Endpoint[] = [];

  public get metadata(): EndpointMetadata[] {
    // TODO: brakuje nazwa metody
    return this.endpoints.map(endpoint => endpoint.metadata);
  }

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public add(endpoint: Endpoint): void {
    if (!endpoint.metadata.path.startsWith('/')) {
      throw new Error(`The path in '${ endpoint.constructor.name }' should start with '/'`);
    }

    // todo endpoint.metadata.schema validation

    const matcher = match(endpoint.metadata.path);

    if (this.endpoints.some(it => it.metadata.method === endpoint.metadata.method && matcher(it.metadata.path))) {
      throw new Error(`Duplicated {${ endpoint.metadata.method } ${ endpoint.metadata.path }} http endpoint`);
    }

    this.endpoints.push(endpoint);
    this.logger.trace(`Mapped {${ endpoint.metadata.method } ${ endpoint.metadata.path }} http endpoint`, HTTP_CONTEXT);
  }

  public find(method: Method, url: string): Endpoint | undefined {
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
