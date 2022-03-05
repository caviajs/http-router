import { ApplicationBuilder } from './application-builder';
import { ApplicationRef } from './application-ref';
import { Type } from './types/type';

export class ApplicationFactory {
  public static configureApplication(application: Type): Promise<ApplicationRef> {
    return ApplicationBuilder
      .init(application)
      .compile();
  }
}
