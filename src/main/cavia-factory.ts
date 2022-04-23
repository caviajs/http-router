import { APPLICATION_METADATA, ApplicationMetadata } from './decorators/application';
import { createApplicationRefProvider } from './providers/application-ref';
import { Env } from './providers/env';
import { Logger } from './providers/logger';
import { LoggerLevelProvider } from './providers/logger-level';
import { LoggerMessageFactoryProvider } from './providers/logger-message-factory';
import { Storage } from './providers/storage';
import { Validator } from './providers/validator';
import { View } from './providers/view';
import { ViewDirectoryPathProvider } from './providers/view-directory-path';
import { Provider } from './types/provider';
import { Token } from './types/token';
import { Type } from './types/type';
import { getProviderToken } from './utils/get-provider-token';
import { CaviaApplication } from './cavia-application';
import { CORE_CONTEXT } from './constants';
import { Injector } from './injector';
import { Body } from './providers/body';
import { BodyManager } from './providers/body-manager';
import { Headers } from './providers/headers';
import { Cookies } from './providers/cookies';
import { HttpServerRegistry } from './providers/http-server-registry';
import { HttpServerExplorer } from './providers/http-server-explorer';
import { HttpServerProvider } from './providers/http-server';
import { HttpServerHandler } from './providers/http-server-handler';
import { HttpServerManager } from './providers/http-server-manager';
import { HttpServerPortProvider } from './providers/http-server-port';
import { HttpClient } from './providers/http-client';
import { ScheduleExplorer } from './providers/schedule-explorer';
import { Schedule } from './providers/schedule';
import { ScheduleManager } from './providers/schedule-manager';
import { SchemaBoolean, SchemaEnum, SchemaNumber, SchemaString } from './types/schema';

const BUILT_IN_PROVIDERS: Provider[] = [
  Body,
  BodyManager,
  Cookies,
  Env,
  Headers,
  HttpClient,
  HttpServerProvider,
  HttpServerExplorer,
  HttpServerHandler,
  HttpServerManager,
  HttpServerPortProvider,
  HttpServerRegistry,
  Logger,
  LoggerLevelProvider,
  LoggerMessageFactoryProvider,
  Schedule,
  ScheduleExplorer,
  ScheduleManager,
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

    (await injector.find(Logger)).trace('Starting application...', CORE_CONTEXT);

    if (options?.env) {
      const env = await injector.find(Env);
      const validator = await injector.find(Validator);
      const validateErrors = validator.validate(
        {
          members: options.env,
          required: true,
          strict: false,
          type: 'object',
        },
        Object
          .keys(options.env)
          .reduce((previousValue, currentValue) => {
            return { ...previousValue, [currentValue]: env.get(currentValue) };
          }, {}),
      );

      if (validateErrors.length) {
        throw new Error(JSON.stringify(validateErrors));
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
  env?: {
    [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
  };
}
