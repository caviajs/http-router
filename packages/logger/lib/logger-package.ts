import { Package, Provider } from '@caviajs/core';
import { Logger } from './providers/logger';
import { LoggerLevelProvider } from './providers/logger-level';
import { LoggerMessageFactoryProvider } from './providers/logger-message-factory';

export class LoggerPackage {
  public static configure(): LoggerPackage {
    return new LoggerPackage();
  }

  private readonly providers: Provider[] = [
    Logger,
    LoggerLevelProvider,
    LoggerMessageFactoryProvider,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
