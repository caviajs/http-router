import { LOGGER_LEVEL, LoggerLevel } from '@caviajs/logger';
import { ApplicationBuilder } from './application-builder';

export class ApplicationTest {
  public static configureTestingApplication(application: any): ApplicationBuilder {
    return ApplicationBuilder
      .init(application)
      .overrideProvider(LOGGER_LEVEL)
      .useValue(LoggerLevel.OFF);
  }
}
