import { Logger, LoggerLevelProvider, LoggerMessageFactoryProvider, LoggerPackage } from '../index';

describe('StoragePackage', () => {
  it('should contain built-in providers', () => {
    const bullPackage = LoggerPackage
      .configure()
      .register();

    expect(bullPackage.providers.length).toBe(3);
    expect(bullPackage.providers).toEqual([
      Logger,
      LoggerLevelProvider,
      LoggerMessageFactoryProvider,
    ]);
  });
});
