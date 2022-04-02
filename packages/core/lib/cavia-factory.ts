import { Type } from './types/type';
import { CaviaApplication } from './cavia-application';
import { CaviaApplicationBuilder } from './cavia-application-builder';

export class CaviaFactory {
  public static create(application: Type): Promise<CaviaApplication> {
    return new CaviaApplicationBuilder(application)
      .compile();
  }
}
