import { CaviaBuilder } from './cavia-builder';
import { CaviaApplication } from './cavia-application';
import { Type } from './types/type';

export class CaviaFactory {
  public static create(application: Type): Promise<CaviaApplication> {
    return new CaviaBuilder(application)
      .compile();
  }
}
