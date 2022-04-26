import { ScheduleManager } from './schedule-manager';
import { Logger } from './logger';
import { Schedule } from './schedule';
import { SCHEDULE_CONTEXT } from '../constants';

describe('ScheduleManager', () => {
  const loggerTrace = jest.fn();

  let schedule: Schedule;
  let scheduleManager: ScheduleManager;

  beforeEach(() => {
    const logger: Partial<Logger> = {
      trace: loggerTrace,
    };

    schedule = new Schedule(logger as any);
    scheduleManager = new ScheduleManager(logger as any, schedule);

    jest.spyOn(schedule, 'start');
    jest.spyOn(schedule, 'stop');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationListen', () => {
    it('should start schedule', async () => {
      expect(loggerTrace).toHaveBeenCalledTimes(0);
      expect(schedule.start).toHaveBeenCalledTimes(0);

      await scheduleManager.onApplicationListen();

      expect(loggerTrace).toHaveBeenCalledTimes(1);
      expect(loggerTrace).toHaveBeenCalledWith('Schedule has been started', SCHEDULE_CONTEXT);
      expect(schedule.start).toHaveBeenCalledTimes(1);
    });
  });

  describe('onApplicationShutdown', () => {
    it('should stop schedule', async () => {
      expect(loggerTrace).toHaveBeenCalledTimes(0);
      expect(schedule.stop).toHaveBeenCalledTimes(0);

      await scheduleManager.onApplicationShutdown();

      expect(loggerTrace).toHaveBeenCalledTimes(1);
      expect(loggerTrace).toHaveBeenCalledWith('Schedule has been stopped', SCHEDULE_CONTEXT);
      expect(schedule.stop).toHaveBeenCalledTimes(1);
    });
  });
});
