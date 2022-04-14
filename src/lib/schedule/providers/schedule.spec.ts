import { Worker } from '../adapters/worker';
import { Schedule } from './schedule';
import { LoggerLevel } from '../../logger/providers/logger-level';
import { Logger } from '../../logger/providers/logger';
import { LOGGER_CONTEXT } from '../../constants';

jest.mock('../adapters/worker');

describe('Schedule', () => {
  let logger: Logger;
  let schedule: Schedule;

  beforeEach(() => {
    logger = new Logger(LoggerLevel.ALL, () => '');
    schedule = new Schedule(logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a Worker instance', async () => {
      const loggerTraceSpy = jest.spyOn(logger, 'trace');
      const workerConstructorSpy = jest.spyOn(Worker.prototype as any, 'constructor');

      const expression: string = '* * * * *';
      const callback: jest.Mock = jest.fn();

      expect(loggerTraceSpy).toHaveBeenCalledTimes(0);
      expect(workerConstructorSpy).toHaveBeenCalledTimes(0);

      schedule.register(expression, callback);

      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, `Mapped {${ expression }} schedule worker`, LOGGER_CONTEXT);
      expect(workerConstructorSpy).toHaveBeenNthCalledWith(1, expression, callback);
    });
  });

  describe('start', () => {
    it('should call the start method on each Worker instance', async () => {
      const callbackSpy = jest.fn();
      const workerStartSpy = jest.spyOn(Worker.prototype, 'start');

      schedule.register('0 0 1 * *', jest.fn());
      schedule.register('0 0 2 * *', jest.fn());

      expect(callbackSpy).toHaveBeenCalledTimes(0);
      expect(workerStartSpy).toHaveBeenCalledTimes(0);

      schedule.start(callbackSpy);

      expect(callbackSpy).toHaveBeenCalledTimes(1);
      expect(workerStartSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('stop', () => {
    it('should call the stop method on each Worker instance', async () => {
      const callbackSpy = jest.fn();
      const workerStopSpy = jest.spyOn(Worker.prototype, 'stop');

      schedule.register('0 0 1 * *', jest.fn());
      schedule.register('0 0 2 * *', jest.fn());

      expect(callbackSpy).toHaveBeenCalledTimes(0);
      expect(workerStopSpy).toHaveBeenCalledTimes(0);

      schedule.stop(callbackSpy);

      expect(callbackSpy).toHaveBeenCalledTimes(1);
      expect(workerStopSpy).toHaveBeenCalledTimes(2);
    });
  });
});
