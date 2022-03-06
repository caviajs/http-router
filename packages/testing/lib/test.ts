import { ApplicationBuilder } from '@caviajs/core';
import { LOGGER_LEVEL, LoggerLevel } from '@caviajs/logger';

export class Test {
  public static configureTestingApplication(application: any): ApplicationBuilder {
    return ApplicationBuilder
      .init(application)
      .overrideProvider(LOGGER_LEVEL)
      .useValue(LoggerLevel.OFF);
  }
}
