import { ViewPackage } from './view-package';
import { View } from './providers/view';
import { ViewDirectoryPathProvider } from './providers/view-directory-path';

describe('ViewPackage', () => {
  it('should contain built-in providers', () => {
    const viewPackage = ViewPackage
      .configure()
      .register();

    expect(viewPackage.providers.length).toBe(2);
    expect(viewPackage.providers).toEqual([View, ViewDirectoryPathProvider]);
  });
});
