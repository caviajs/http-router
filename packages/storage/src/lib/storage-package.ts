import { Package, Provider } from '@caviajs/core';
import { Storage } from './providers/storage';

export class StoragePackage {
  public static configure(): StoragePackage {
    return new StoragePackage();
  }

  private readonly providers: Provider[] = [
    Storage,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
