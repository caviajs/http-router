import { HttpServerRegistry } from './http-server-registry';
import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Injector } from '../injector';
import { Controller } from '../types/controller';

@Injectable()
export class HttpServerExplorer implements OnApplicationBoot {
  constructor(
    protected readonly httpServerRegistry: HttpServerRegistry,
    protected readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const controllers: Controller[] = await this
      .injector
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Controller);

    controllers
      .map((controller: Controller) => {
        this.httpServerRegistry.push(controller);
      });
  }
}
