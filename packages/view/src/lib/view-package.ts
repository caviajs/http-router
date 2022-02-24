import { Package, Provider } from '@caviajs/core';
import { View } from './providers/view';
import { viewDirectoryPathProvider } from './providers/view-directory-path';

export class ViewPackage {
  public static configure(): ViewPackage {
    return new ViewPackage();
  }

  private readonly providers: Provider[] = [
    View,
    viewDirectoryPathProvider,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
