import { Schedule } from './schedule';
import { Logger } from './logger';
import { Worker, WorkerMetadata } from '../types/worker';
import { SCHEDULE_CONTEXT } from '../constants';
import cron from 'node-cron';

class ScheduleTest extends Schedule {
  public readonly workers: Worker[] = [];
  public readonly tasks: cron.ScheduledTask[] = [];
}

class FooWorker extends Worker {
  public readonly metadata: WorkerMetadata = {
    expression: '* * * * *',
  };

  public handle(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

describe('Schedule', () => {
  const loggerTrace = jest.fn();

  let schedule: ScheduleTest;
  let fooWorker: FooWorker;

  beforeEach(() => {
    const logger: Partial<Logger> = {
      trace: loggerTrace,
    };

    schedule = new ScheduleTest(logger as any);
    fooWorker = new FooWorker();
  });

  describe('add', () => {
    it('should throw an exception if the worker expression is invalid', () => {
      class InvalidWorker extends Worker {
        public readonly metadata: WorkerMetadata = {
          expression: 'invalid-expression',
        };

        public handle(): Promise<void> {
          return Promise.resolve(undefined);
        }
      }

      const invalidWorker = new InvalidWorker();

      try {
        schedule.add(invalidWorker);
      } catch (e) {
        expect(e.message).toBe(`Invalid {${ invalidWorker.metadata.expression }} worker expression`);
      }
    });

    it('should add worker to registry', () => {
      expect(schedule.workers).toEqual([]);
      expect(loggerTrace).toHaveBeenCalledTimes(0);

      schedule.add(fooWorker);

      expect(schedule.workers).toEqual([fooWorker]);
      expect(loggerTrace).toHaveBeenCalledTimes(1);
      expect(loggerTrace).toHaveBeenCalledWith(`Mapped {${ fooWorker.metadata.expression }} schedule worker`, SCHEDULE_CONTEXT);
    });
  });

  // describe('start', () => {
  //   it('should call the start method on ScheduledTask instance', () => {
  //     const worker = new Worker('* * * * *', jest.fn());
  //
  //     expect(scheduleStartSpy).toHaveBeenCalledTimes(0);
  //
  //     worker.start();
  //
  //     expect(scheduleStartSpy).toHaveBeenCalledTimes(1);
  //   });
  // });
  //
  // describe('stop', () => {
  //   it('should call the stop method on ScheduledTask instance', function () {
  //     const task = cron.schedule('* * * * *', jest.fn(), { scheduled: false });
  //
  //     schedule.tasks.push(task);
  //
  //     expect(scheduleStopSpy).toHaveBeenCalledTimes(0);
  //
  //     worker.stop();
  //
  //     expect(scheduleStopSpy).toHaveBeenCalledTimes(1);
  //   });
  // });
});
