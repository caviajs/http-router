import { LOGGER_LEVEL, LoggerLevel } from '@caviajs/logger';
import { CaviaBuilder } from './cavia-builder';

export class Test {
  public static createTestingApplication(application: any): CaviaBuilder {
    return new CaviaBuilder(application)
      .overrideProvider(LOGGER_LEVEL)
      .useValue(LoggerLevel.OFF);
  }
}
