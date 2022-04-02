import { Logger } from '@caviajs/logger';
import { APPLICATION_METADATA, ApplicationMetadata } from './decorators/application';
import { Provider } from './types/provider';
import { Token } from './types/token';
import { Type } from './types/type';
import { getProviderToken } from './utils/get-provider-token';
import { CaviaApplication } from './cavia-application';
import { LOGGER_CONTEXT } from './constants';
import { Injector } from './injector';

export class CaviaApplicationBuilder {
  protected readonly providers: Map<Token, Provider> = new Map();

  constructor(application: Type) {
    if (Reflect.hasMetadata(APPLICATION_METADATA, application) === false) {
      throw new Error(`The '${ application?.name }' should be annotated as an application`);
    }

    const applicationMetadata: ApplicationMetadata = Reflect.getMetadata(APPLICATION_METADATA, application);

    for (const pkg of [...applicationMetadata?.packages || []]) {
      for (const provider of pkg.providers || []) {
        this.providers.set(getProviderToken(provider), provider);
      }
    }

    // todo { provide: APPLICATION_REF, useExisting: application } ?
    for (const provider of [...applicationMetadata?.providers || [], application]) {
      this.providers.set(getProviderToken(provider), provider);
    }
  }

  public async compile(): Promise<CaviaApplication> {
    const injector = await Injector.create([...this.providers.values()]);
    const logger: Logger = await injector.find(Logger);
    const caviaApplication: CaviaApplication = new CaviaApplication(injector);

    logger?.trace('Starting application...', LOGGER_CONTEXT);

    await caviaApplication.boot();

    return caviaApplication;
  }

  public overrideProvider(token: Token): OverrideBy<CaviaApplicationBuilder> {
    return {
      useClass: (type: Type) => {
        return this.override(token, { provide: token, useClass: type });
      },
      useFactory: (options: OverrideByFactoryOptions) => {
        return this.override(token, { provide: token, useFactory: options.factory, dependencies: options.dependencies });
      },
      useValue: (value: any) => {
        return this.override(token, { provide: token, useValue: value });
      },
    };
  }

  protected override(token: Token, provider: Provider): CaviaApplicationBuilder {
    this.providers.set(token, provider);

    return this;
  }
}

export interface OverrideBy<T> {
  useClass: (type: Type) => T;
  useFactory: (options: OverrideByFactoryOptions) => T;
  useValue: (value: any) => T;
}

export interface OverrideByFactoryOptions {
  factory: (...args: any[]) => any;
  dependencies?: Token[];
}
