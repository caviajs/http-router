import { LOGGER_LEVEL, LoggerLevel } from '@caviajs/logger';
import { CaviaApplicationBuilder } from './cavia-application-builder';

export class Test {
  public static createTestingApplication(application: any): CaviaApplicationBuilder {
    return new CaviaApplicationBuilder(application)
      .overrideProvider(LOGGER_LEVEL)
      .useValue(LoggerLevel.OFF);
  }
}
