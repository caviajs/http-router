import { ApplicationBuilder } from './application-builder';
import { LOGGER_LEVEL, LoggerLevel } from './providers/logger-level';

export class Test {
  public static configureTestingApplication(application: any): ApplicationBuilder {
    return ApplicationBuilder
      .init(application)
      .overrideProvider(LOGGER_LEVEL)
      .useValue(LoggerLevel.OFF);
  }
}
