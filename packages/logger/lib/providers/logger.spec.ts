import { Logger } from './logger';
import { LoggerLevel } from './logger-level';

const message: string = 'Hello Cavia';

describe('Logger', () => {
  let writeSpy: jest.SpyInstance;

  beforeEach(() => {
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('LoggerLevel.OFF', () => {
    const logger: Logger = new Logger(LoggerLevel.OFF, () => '');

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.FATAL', () => {
    const logger: Logger = new Logger(LoggerLevel.FATAL, () => '');

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.ERROR', () => {
    const logger: Logger = new Logger(LoggerLevel.ERROR, () => '');

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);

      expect(writeSpy).toHaveBeenCalledTimes(2);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.WARN', () => {
    const logger: Logger = new Logger(LoggerLevel.WARN, () => '');

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);

      expect(writeSpy).toHaveBeenCalledTimes(3);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.INFO', () => {
    const logger: Logger = new Logger(LoggerLevel.INFO, () => '');

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);

      expect(writeSpy).toHaveBeenCalledTimes(4);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.debug(message);
      logger.trace(message);

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.DEBUG', () => {
    const logger: Logger = new Logger(LoggerLevel.DEBUG, () => '');

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);

      expect(writeSpy).toHaveBeenCalledTimes(5);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.trace(message);

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.TRACE', () => {
    const logger: Logger = new Logger(LoggerLevel.TRACE, () => '');

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(writeSpy).toHaveBeenCalledTimes(6);
    });
  });

  describe('LoggerLevel.ALL', () => {
    const logger: Logger = new Logger(LoggerLevel.ALL, () => '');

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(writeSpy).toHaveBeenCalledTimes(6);
    });
  });
});
