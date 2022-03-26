import { Package, Provider } from '@caviajs/core';
import { Validator } from './providers/validator';

export class ValidatorPackage {
  public static configure(): ValidatorPackage {
    return new ValidatorPackage();
  }

  private readonly providers: Provider[] = [
    Validator,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
