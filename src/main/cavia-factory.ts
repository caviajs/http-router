import { APPLICATION_METADATA, ApplicationMetadata } from './decorators/application';
import { createApplicationRefProvider } from './providers/application-ref';
import { Env } from './providers/env';
import { EnvPathProvider } from './providers/env-path';
import { Logger } from './providers/logger';
import { LoggerLevelProvider } from './providers/logger-level';
import { LoggerMessageFactoryProvider } from './providers/logger-message-factory';
import { Schedule } from './providers/schedule';
import { ScheduleManager } from './providers/schedule-manager';
import { Storage } from './providers/storage';
import { Validator } from './providers/validator';
import { View } from './providers/view';
import { ViewDirectoryPathProvider } from './providers/view-directory-path';
import { Provider } from './types/provider';
import { Token } from './types/token';
import { Type } from './types/type';
import { getProviderToken } from './utils/get-provider-token';
import { CaviaApplication } from './cavia-application';
import { LOGGER_CONTEXT } from './constants';
import { Injector } from './injector';
import { Body } from './providers/body';
import { Cookies } from './providers/cookies';
import { HttpRouter } from './providers/http-router';
import { HttpRouterManager } from './providers/http-router-manager';
import { HttpServerProvider } from './providers/http-server';
import { HttpServerHandler } from './providers/http-server-handler';
import { HttpServerManager } from './providers/http-server-manager';
import { HttpServerPortProvider } from './providers/http-server-port';
import { MimeType } from './providers/mime-type';
import { Url } from './providers/url';
import { SchemaBoolean, SchemaEnum, SchemaNumber, SchemaString } from './types/schema';
import { EventEmitter } from './providers/event-emitter';
import { EventEmitterManager } from './providers/event-emitter-manager';
import { HttpClient } from './providers/http-client';

const BUILT_IN_PROVIDERS: Provider[] = [
  Body,
  Cookies,
  Env,
  EnvPathProvider,
  EventEmitter,
  EventEmitterManager,
  HttpClient,
  HttpRouter,
  HttpRouterManager,
  HttpServerProvider,
  HttpServerHandler,
  HttpServerManager,
  HttpServerPortProvider,
  Logger,
  LoggerLevelProvider,
  LoggerMessageFactoryProvider,
  MimeType,
  Schedule,
  ScheduleManager,
  Storage,
  Url,
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
      const validateErrors = await validator.validate(
        {
          members: options.env,
          required: true,
          strict: false,
          type: 'object',
        },
        env.variables,
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
