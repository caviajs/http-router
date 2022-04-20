import { HttpRouter } from './http-router';
import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Injector } from '../injector';
import { Route } from '../types/route';

@Injectable()
export class RouteExplorer implements OnApplicationBoot {
  constructor(
    protected readonly httpRouter: HttpRouter,
    protected readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const routes: Route[] = await this
      .injector
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Route);

    routes
      .map((route: Route) => {
        this.httpRouter.push(route);
      });
  }
}
