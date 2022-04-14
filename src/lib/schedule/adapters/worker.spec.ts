import { Worker } from './worker';

const scheduleStartSpy = jest.fn();
const scheduleStopSpy = jest.fn();
const scheduleSpy = jest.fn().mockImplementation(() => {
  return {
    start: scheduleStartSpy,
    stop: scheduleStopSpy,
  };
});
const validateSpy = jest.fn().mockImplementation(expression => {
  return expression !== 'invalid-expression';
});

jest.mock('node-cron', () => {
  return {
    schedule: (expression, callback, options) => scheduleSpy(expression, callback, options),
    validate: (expression) => validateSpy(expression),
  };
});

describe('Worker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a ScheduledTask instance', () => {
    const expression: string = '* * * * *';
    const callback: jest.Mock = jest.fn();

    new Worker(expression, callback);

    expect(scheduleSpy).toHaveBeenNthCalledWith(1, expression, callback, { scheduled: false });
  });

  it('should throw an exception if the cron expression is invalid', () => {
    const expression: string = 'invalid-expression';

    try {
      new Worker(expression, jest.fn());
    } catch (e) {
      expect(e.message).toBe(`Invalid {${ expression }} cron expression`);
    }
  });

  describe('start', () => {
    it('should call the start method on ScheduledTask instance', () => {
      const worker = new Worker('* * * * *', jest.fn());

      expect(scheduleStartSpy).toHaveBeenCalledTimes(0);

      worker.start();

      expect(scheduleStartSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop', () => {
    it('should call the stop method on ScheduledTask instance', function () {
      const worker = new Worker('* * * * *', jest.fn());

      expect(scheduleStopSpy).toHaveBeenCalledTimes(0);

      worker.stop();

      expect(scheduleStopSpy).toHaveBeenCalledTimes(1);
    });
  });
});
