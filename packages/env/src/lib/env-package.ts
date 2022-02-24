import { Package, Provider } from '@caviajs/core';
import { Env } from './providers/env';
import { envPathProvider } from './providers/env-path';

export class EnvPackage {
  public static configure(): EnvPackage {
    return new EnvPackage();
  }

  private readonly providers: Provider[] = [
    Env,
    envPathProvider,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
