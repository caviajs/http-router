import { View, ViewPackage, viewDirectoryPathProvider } from '../index';

describe('ViewPackage', () => {
  it('should contain built-in providers', () => {
    const viewPackage = ViewPackage
      .configure()
      .register();

    expect(viewPackage.providers.length).toBe(2);
    expect(viewPackage.providers).toEqual([View, viewDirectoryPathProvider]);
  });
});
