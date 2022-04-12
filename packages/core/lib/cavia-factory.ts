import { APPLICATION_METADATA, ApplicationMetadata } from './decorators/application';
import { createApplicationRefProvider } from './providers/application-ref';
import { Env } from './providers/env';
import { EnvPathProvider } from './providers/env-path';
import { Logger } from './providers/logger';
import { LoggerLevelProvider } from './providers/logger-level';
import { LoggerMessageFactoryProvider } from './providers/logger-message-factory';
import { Storage } from './providers/storage';
import { Schema, Validator } from './providers/validator';
import { View } from './providers/view';
import { ViewDirectoryPathProvider } from './providers/view-directory-path';
import { Provider } from './types/provider';
import { Token } from './types/token';
import { Type } from './types/type';
import { getProviderToken } from './utils/get-provider-token';
import { CaviaApplication } from './cavia-application';
import { LOGGER_CONTEXT } from './constants';
import { Injector } from './injector';

const BUILT_IN_PROVIDERS: Provider[] = [
  Env,
  EnvPathProvider,
  Logger,
  LoggerLevelProvider,
  LoggerMessageFactoryProvider,
  Storage,
  Validator,
  View,
  ViewDirectoryPathProvider,
];

export class CaviaFactory {
  public static async create(application: Type, options?: CaviaFactoryOptions): Promise<CaviaApplication> {
    if (Reflect.hasMetadata(APPLICATION_METADATA, application) === false) {
      throw new Error(`The '${ application?.name }' should be annotated as an application`);
    }

    const injector: Injector = await Injector.create([...this.getApplicationProviders(application).values()]);
    const caviaApplication: CaviaApplication = new CaviaApplication(injector);

    (await injector.find(Logger)).trace('Starting application...', LOGGER_CONTEXT);

    if (options?.env) {
      const env = await injector.find(Env);
      const validator = await injector.find(Validator);
      const validateResult = await validator.validate(options.env, env.variables);

      if (validateResult.errors.length) {
        throw new Error(JSON.stringify({ message: 'Invalid env variables', errors: validateResult.errors }));
      }
    }

    await caviaApplication.boot();

    return caviaApplication;
  }

  protected static getApplicationProviders(application: Type): Map<Token, Provider> {
    const applicationMetadata: ApplicationMetadata = Reflect.getMetadata(APPLICATION_METADATA, application);

    const providers: Map<Token, Provider> = new Map();

    for (const pkg of [...applicationMetadata?.packages || []]) {
      for (const provider of pkg.providers || []) {
        providers.set(getProviderToken(provider), provider);
      }
    }

    for (const provider of [...BUILT_IN_PROVIDERS, ...applicationMetadata?.providers || [], createApplicationRefProvider(application)]) {
      providers.set(getProviderToken(provider), provider);
    }

    return providers;
  }
}

export interface CaviaFactoryOptions {
  env?: Schema;
}
