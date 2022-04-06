import { Logger } from './logger';
import { LoggerLevel } from './logger-level';
import { LoggerMessageFactory } from './logger-message-factory';

const context: string = 'Logger';
const message: string = 'Hello Cavia';

describe('Logger', () => {
  const loggerMessageFactorySpy: LoggerMessageFactory = jest.fn().mockImplementation(() => message);
  const writeSpy: jest.SpyInstance = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('LoggerLevel.OFF', () => {
    const logger: Logger = new Logger(LoggerLevel.OFF, loggerMessageFactorySpy);

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
    const logger: Logger = new Logger(LoggerLevel.FATAL, loggerMessageFactorySpy);

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(1);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.FATAL, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(1, message);
    });

    it('should call process.stdout.write for the appropriate levels with context', () => {
      logger.fatal(message, context);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(1);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.FATAL, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(1, message);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(loggerMessageFactorySpy).not.toHaveBeenCalled();
      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.ERROR', () => {
    const logger: Logger = new Logger(LoggerLevel.ERROR, loggerMessageFactorySpy);

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(2);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.ERROR, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(2, message);
    });

    it('should call process.stdout.write for the appropriate levels with context', () => {
      logger.fatal(message, context);
      logger.error(message, context);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(2);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.ERROR, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(2, message);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(loggerMessageFactorySpy).not.toHaveBeenCalled();
      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.WARN', () => {
    const logger: Logger = new Logger(LoggerLevel.WARN, loggerMessageFactorySpy);

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(3);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.WARN, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(3, message);
    });

    it('should call process.stdout.write for the appropriate levels with context', () => {
      logger.fatal(message, context);
      logger.error(message, context);
      logger.warn(message, context);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(3);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.WARN, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(3, message);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(loggerMessageFactorySpy).not.toHaveBeenCalled();
      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.INFO', () => {
    const logger: Logger = new Logger(LoggerLevel.INFO, loggerMessageFactorySpy);

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(4);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.WARN, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.INFO, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(4, message);
    });

    it('should call process.stdout.write for the appropriate levels with context', () => {
      logger.fatal(message, context);
      logger.error(message, context);
      logger.warn(message, context);
      logger.info(message, context);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(4);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.WARN, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.INFO, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(4, message);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.debug(message);
      logger.trace(message);

      expect(loggerMessageFactorySpy).not.toHaveBeenCalled();
      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.DEBUG', () => {
    const logger: Logger = new Logger(LoggerLevel.DEBUG, loggerMessageFactorySpy);

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(5);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.WARN, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.INFO, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.DEBUG, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(5, message);
    });

    it('should call process.stdout.write for the appropriate levels with context', () => {
      logger.fatal(message, context);
      logger.error(message, context);
      logger.warn(message, context);
      logger.info(message, context);
      logger.debug(message, context);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(5);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.WARN, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.INFO, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.DEBUG, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(5, message);
    });

    it('should not call process.stdout.write for the appropriate levels', () => {
      logger.trace(message);

      expect(loggerMessageFactorySpy).not.toHaveBeenCalled();
      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('LoggerLevel.TRACE', () => {
    const logger: Logger = new Logger(LoggerLevel.TRACE, loggerMessageFactorySpy);

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(6);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.WARN, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.INFO, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.DEBUG, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.TRACE, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(6, message);
    });

    it('should call process.stdout.write for the appropriate levels with context', () => {
      logger.fatal(message, context);
      logger.error(message, context);
      logger.warn(message, context);
      logger.info(message, context);
      logger.debug(message, context);
      logger.trace(message, context);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(6);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.WARN, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.INFO, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.DEBUG, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.TRACE, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(6, message);
    });
  });

  describe('LoggerLevel.ALL', () => {
    const logger: Logger = new Logger(LoggerLevel.ALL, loggerMessageFactorySpy);

    it('should call process.stdout.write for the appropriate levels', () => {
      logger.fatal(message);
      logger.error(message);
      logger.warn(message);
      logger.info(message);
      logger.debug(message);
      logger.trace(message);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(6);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.WARN, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.INFO, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.DEBUG, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: undefined, level: LoggerLevel.TRACE, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(6, message);
    });

    it('should call process.stdout.write for the appropriate levels with context', () => {
      logger.fatal(message, context);
      logger.error(message, context);
      logger.warn(message, context);
      logger.info(message, context);
      logger.debug(message, context);
      logger.trace(message, context);

      expect(loggerMessageFactorySpy).toHaveBeenCalledTimes(6);
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.FATAL, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.ERROR, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.WARN, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.INFO, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.DEBUG, message: message });
      expect(loggerMessageFactorySpy).toHaveBeenCalledWith({ context: context, level: LoggerLevel.TRACE, message: message });
      expect(writeSpy).toHaveBeenNthCalledWith(6, message);
    });
  });
});
