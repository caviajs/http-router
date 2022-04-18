import { Injector } from './injector';
import { OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from './types/hooks';
import { isTypeProvider } from './utils/is-type-provider';
import { isClassProvider } from './utils/is-class-provider';

export class CaviaApplication {
  constructor(
    public readonly injector: Injector,
  ) {
  }

  public async boot(): Promise<void> {
    for (const provider of await this.injector.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationBoot).onApplicationBoot) {
        await provider.onApplicationBoot();
      }
    }
  }

  public async listen(): Promise<void> {
    for (const provider of await this.injector.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationListen).onApplicationListen) {
        await provider.onApplicationListen();
      }
    }
  }

  public async shutdown(signal?: string): Promise<void> {
    for (const provider of await this.injector.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationShutdown).onApplicationShutdown) {
        await provider.onApplicationShutdown(signal);
      }
    }
  }
}
