import { StoragePackage } from './storage-package';
import { Storage } from './providers/storage';

describe('StoragePackage', () => {
  it('should contain built-in providers', () => {
    const bullPackage = StoragePackage
      .configure()
      .register();

    expect(bullPackage.providers.length).toBe(1);
    expect(bullPackage.providers).toEqual([Storage]);
  });
});
