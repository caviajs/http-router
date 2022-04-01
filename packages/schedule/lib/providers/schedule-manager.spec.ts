import { Injectable, Injector } from '@caviajs/core';
import { Logger, LoggerLevel } from '@caviajs/logger';
import { Scheduled } from '../decorators/scheduled';
import { Schedule } from './schedule';
import { ScheduleManager } from './schedule-manager';
import { SCHEDULE_CONTEXT } from '../schedule-constants';

@Injectable()
class FooWorker {
  @Scheduled('* * * * *')
  foo() {
  }
}

@Injectable()
class BarWorker {
  @Scheduled('0 0 1 * *')
  bar() {
  }

  @Scheduled('0 0 15 * *')
  baz() {
  }
}

describe('ScheduleManager', () => {
  let logger: Logger;
  let schedule: Schedule;
  let scheduleManager: ScheduleManager;

  beforeEach(async () => {
    logger = new Logger(LoggerLevel.ALL, () => '');
    schedule = new Schedule(logger);
    scheduleManager = new ScheduleManager(await Injector.create([FooWorker, BarWorker]), logger, schedule);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should register the appropriate workers according to the metadata', async () => {
      const scheduleRegisterSpy = jest.spyOn(schedule, 'register').mockImplementation(jest.fn());

      expect(scheduleRegisterSpy).toHaveBeenCalledTimes(0);

      await scheduleManager.onApplicationBoot();

      expect(scheduleRegisterSpy).toHaveBeenCalledTimes(3);
      expect(scheduleRegisterSpy).toHaveBeenCalledWith('* * * * *', expect.any(Function));
      expect(scheduleRegisterSpy).toHaveBeenCalledWith('0 0 1 * *', expect.any(Function));
      expect(scheduleRegisterSpy).toHaveBeenCalledWith('0 0 15 * *', expect.any(Function));
    });
  });

  describe('onApplicationListen', () => {
    it('should start a schedule', async () => {
      const scheduleStartSpy = jest.spyOn(schedule, 'start');
      const loggerTraceSpy = jest.spyOn(logger, 'trace');

      expect(scheduleStartSpy).toHaveBeenCalledTimes(0);

      await scheduleManager.onApplicationListen();

      expect(scheduleStartSpy).toHaveBeenCalledTimes(1);
      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, 'Schedule has been started', SCHEDULE_CONTEXT);
    });
  });

  describe('onApplicationShutdown', () => {
    it('should stop a schedule', async () => {
      const scheduleStopSpy = jest.spyOn(schedule, 'stop');
      const loggerTraceSpy = jest.spyOn(logger, 'trace');

      expect(scheduleStopSpy).toHaveBeenCalledTimes(0);

      await scheduleManager.onApplicationShutdown();

      expect(scheduleStopSpy).toHaveBeenCalledTimes(1);
      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, 'Schedule has been stopped', SCHEDULE_CONTEXT);
    });
  });
});
