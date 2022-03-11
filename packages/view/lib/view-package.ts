import { Package, Provider } from '@caviajs/core';
import { View } from './providers/view';
import { ViewDirectoryPathProvider } from './providers/view-directory-path';

export class ViewPackage {
  public static configure(): ViewPackage {
    return new ViewPackage();
  }

  private readonly providers: Provider[] = [
    View,
    ViewDirectoryPathProvider,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
