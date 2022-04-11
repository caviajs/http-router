import { Package, Provider } from '@caviajs/core';
import { Schedule } from './providers/schedule';
import { ScheduleManager } from './providers/schedule-manager';

export class SchedulePackage {
  public static configure(): SchedulePackage {
    return new SchedulePackage();
  }

  protected readonly providers: Provider[] = [
    Schedule,
    ScheduleManager,
  ];

  protected constructor() {
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
