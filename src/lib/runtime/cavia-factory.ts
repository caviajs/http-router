import { APPLICATION_METADATA, ApplicationMetadata } from './decorators/application';
import { createApplicationRefProvider } from './providers/application-ref';
import { Env } from '../env/providers/env';
import { EnvPathProvider } from '../env/providers/env-path';
import { Logger } from '../logger/providers/logger';
import { LoggerLevelProvider } from '../logger/providers/logger-level';
import { LoggerMessageFactoryProvider } from '../logger/providers/logger-message-factory';
import { Schedule } from '../schedule/providers/schedule';
import { ScheduleManager } from '../schedule/providers/schedule-manager';
import { Storage } from '../storage/providers/storage';
import { SchemaBoolean, SchemaEnum, SchemaNumber, SchemaString, Validator } from '../validator/providers/validator';
import { View } from '../view/providers/view';
import { ViewDirectoryPathProvider } from '../view/providers/view-directory-path';
import { Provider } from '../ioc/types/provider';
import { Token } from '../ioc/types/token';
import { Type } from '../ioc/types/type';
import { getProviderToken } from '../ioc/utils/get-provider-token';
import { CaviaApplication } from './cavia-application';
import { LOGGER_CONTEXT } from '../constants';
import { Injector } from '../ioc/injector';
import { Body } from '../http/providers/body';
import { Cookies } from '../http/providers/cookies';
import { HttpRouter } from '../http/providers/http-router';
import { HttpRouterManager } from '../http/providers/http-router-manager';
import { HttpServerProvider } from '../http/providers/http-server';
import { HttpServerHandler } from '../http/providers/http-server-handler';
import { HttpServerManager } from '../http/providers/http-server-manager';
import { HttpServerPortProvider } from '../http/providers/http-server-port';
import { MimeType } from '../http/providers/mime-type';
import { Url } from '../http/providers/url';

const BUILT_IN_PROVIDERS: Provider[] = [
  Env,
  EnvPathProvider,
  Logger,
  LoggerLevelProvider,
  LoggerMessageFactoryProvider,
  Schedule,
  ScheduleManager,
  Storage,
  Validator,
  View,
  ViewDirectoryPathProvider,
  Body,
  Cookies,
  HttpRouter,
  HttpRouterManager,
  HttpServerProvider,
  HttpServerHandler,
  HttpServerManager,
  HttpServerPortProvider,
  MimeType,
  Url,
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
