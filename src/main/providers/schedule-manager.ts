import { Schedule } from './schedule';
import { Injectable } from '../decorators/injectable';
import { Logger } from './logger';
import { OnApplicationListen, OnApplicationShutdown } from '../types/hooks';
import { SCHEDULE_CONTEXT } from '../constants';

@Injectable()
export class ScheduleManager implements OnApplicationListen, OnApplicationShutdown {
  constructor(
    protected readonly logger: Logger,
    protected readonly schedule: Schedule,
  ) {
  }

  public async onApplicationListen(): Promise<void> {
    await new Promise<void>(resolve => {
      this.schedule.start(() => resolve());
    });

    this.logger.trace('Schedule has been started', SCHEDULE_CONTEXT);
  }

  public async onApplicationShutdown(): Promise<void> {
    await new Promise<void>(resolve => {
      this.schedule.stop(() => resolve());
    });

    this.logger.trace('Schedule has been stopped', SCHEDULE_CONTEXT);
  }
}
