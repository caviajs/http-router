import { match } from 'path-to-regexp';
import { parse } from 'url';
import { Method } from '../types/method';
import { Injectable } from '../decorators/injectable';
import { Logger } from './logger';
import { HTTP_CONTEXT } from '../constants';
import { Controller, ControllerMetadata } from '../types/controller';

@Injectable()
export class HttpServerRegistry {
  protected readonly controllers: Controller[] = [];

  public get metadata(): ControllerMetadata[] {
    // TODO: brakuje nazwa metody
    return this.controllers.map(controller => controller.metadata);
  }

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public find(method: Method, url: string): Controller | undefined {
    let controller: Controller | undefined;

    const pathname: string = parse(url).pathname;

    for (const it of this.controllers.filter(r => r.metadata.method === method)) {
      if (match(it.metadata.path)(pathname)) {
        controller = it;
        break;
      }
    }

    return controller;
  }

  public push(controller: Controller): void {
    if (!controller.metadata.path.startsWith('/')) {
      throw new Error(`The path in '${ controller.constructor.name }' should start with '/'`);
    }

    const matcher = match(controller.metadata.path);

    if (this.controllers.some(it => it.metadata.method === controller.metadata.method && matcher(it.metadata.path))) {
      throw new Error(`Duplicated {${ controller.metadata.method } ${ controller.metadata.path }} http endpoint`);
    }

    this.controllers.push(controller);
    this.logger.trace(`Mapped {${ controller.metadata.method } ${ controller.metadata.path }} http endpoint`, HTTP_CONTEXT);
  }
}
