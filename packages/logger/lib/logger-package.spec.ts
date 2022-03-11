import { LoggerPackage } from './logger-package';
import { Logger } from './providers/logger';
import { LoggerLevelProvider } from './providers/logger-level';
import { LoggerMessageFactoryProvider } from './providers/logger-message-factory';

describe('LoggerPackage', () => {
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
