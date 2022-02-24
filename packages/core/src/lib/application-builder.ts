import { Token } from './types/token';
import { Provider } from './types/provider';
import { ApplicationRef } from './application-ref';
import { Type } from './types/type';
import { isTypeProvider } from './utils/is-type-provider';
import { getCaviaApplicationMetadata, hasCaviaApplicationMetadata } from './decorators/cavia-application';
import { Package } from './types/package';
import { Logger } from './providers/logger';
import { LoggerLevelProvider } from './providers/logger-level';
import { LoggerMessageFactoryProvider } from './providers/logger-message-factory';

const BUILT_IN_SERVICES: Provider[] = [
  Logger,
  LoggerLevelProvider,
  LoggerMessageFactoryProvider,
];

export class ApplicationBuilder {
  public static init(application: Type): ApplicationBuilder {
    if (!hasCaviaApplicationMetadata(application)) {
      throw new Error(`The '${ application?.name }' should be annotated as cavia application`);
    }

    const caviaApplicationMetadata = getCaviaApplicationMetadata(application);

    const packages: Package[] = [...caviaApplicationMetadata?.packages || []];
    const providers: Provider[] = [...BUILT_IN_SERVICES, ...caviaApplicationMetadata?.providers || [], application];

    return new ApplicationBuilder([
      ...packages.map(it => it.providers || []).flat(),
      ...providers,
    ]);
  }

  protected constructor(
    private readonly providers: Provider[],
  ) {
  }

  public async compile(): Promise<ApplicationRef> {
    return await ApplicationRef.compile({
      providers: this.providers.reverse(), // todo rethink (.reverse())
    });
  }

  public overrideProvider(token: Token): OverrideBy<ApplicationBuilder> {
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

  protected override(token: Token, provider: Provider): ApplicationBuilder {
    const index: number = this.providers.findIndex(it => token === (isTypeProvider(it) ? it : it.provide));

    if (index !== -1) {
      this.providers.splice(index, 1, provider);
    }

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
