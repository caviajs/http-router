import { Logger, LoggerLevel } from '../../index';

describe('Logger', () => {
  const logger: Logger = new Logger(LoggerLevel.TRACE, () => '');

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('debug method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.debug('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('error method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.error('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('fatal method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.fatal('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('info method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.info('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('trace method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.trace('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.warn('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
