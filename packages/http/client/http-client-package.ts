import { Package, Provider } from '@caviajs/core';
import { HttpClient } from './providers/http-client';

export class HttpClientPackage {
  public static configure(): HttpClientPackage {
    return new HttpClientPackage();
  }

  protected readonly providers: Provider[] = [
    HttpClient,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
