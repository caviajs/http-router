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
import { getProviderToken } from './utils/get-provider-token';
import { CaviaApplication } from './cavia-application';
import { CORE_CONTEXT } from './constants';
import { Injector } from './injector';
import { Body } from './providers/body';
import { BodyExplorer } from './providers/body-explorer';
import { HttpServerRouter } from './providers/http-server-router';
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
  BodyExplorer,
  Env,
  HttpClient,
  HttpServerProvider,
  HttpServerExplorer,
  HttpServerHandler,
  HttpServerManager,
  HttpServerPortProvider,
  HttpServerRouter,
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
  public static async create(options: CaviaFactoryOptions): Promise<CaviaApplication> {
    const injector: Injector = await this.createInjector(options);
    const caviaApplication: CaviaApplication = new CaviaApplication(injector);

    (await injector.find(Logger)).trace('Starting application...', CORE_CONTEXT);

    await this.validateEnv(injector, options);
    await caviaApplication.boot();

    return caviaApplication;
  }

  protected static async createInjector(options: CaviaFactoryOptions): Promise<Injector> {
    const providers: Map<Token, Provider> = new Map();

    for (const provider of [...BUILT_IN_PROVIDERS, ...options?.providers || []]) {
      providers.set(getProviderToken(provider), provider);
    }

    return await Injector.create([...providers.values()]);
  }

  protected static async validateEnv(injector: Injector, options: CaviaFactoryOptions): Promise<void | never> {
    if (options?.schemas?.env) {
      const env = await injector.find(Env);
      const validator = await injector.find(Validator);
      const validateErrors = validator.validate(
        {
          additionalProperties: true,
          properties: options.schemas.env,
          required: true,
          type: 'object',
        },
        Object
          .keys(options.schemas.env)
          .reduce((previousValue, currentValue) => {
            return { ...previousValue, [currentValue]: env.get(currentValue) };
          }, {}),
      );

      if (validateErrors.length) {
        throw new Error(JSON.stringify(validateErrors));
      }
    }
  }
}

export interface CaviaFactoryOptions {
  providers?: Provider[];

  schemas?: {
    env?: {
      [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
    };
  };
}
