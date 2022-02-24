import { LOGGER_MESSAGE_FACTORY, LoggerMessageFactoryProvider } from '../../../src/public-api';

describe('LoggerMessageFactoryProvider', () => {
  it('should have the appropriate token', () => {
    expect(LoggerMessageFactoryProvider.provide).toEqual(LOGGER_MESSAGE_FACTORY);
  });

  it('should have the appropriate factory', () => {
    expect(LoggerMessageFactoryProvider.useFactory).toEqual(expect.any(Function));
  });
});
