import { SchedulePackage } from './schedule-package';
import { Schedule } from './providers/schedule';
import { ScheduleManager } from './providers/schedule-manager';

describe('SchedulePackage', () => {
  it('should contain built-in providers', () => {
    const schedulePackage = SchedulePackage
      .configure()
      .register();

    expect(schedulePackage.providers.length).toBe(2);
    expect(schedulePackage.providers).toEqual([
      Schedule,
      ScheduleManager,
    ]);
  });
});
