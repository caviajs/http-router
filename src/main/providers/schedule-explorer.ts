import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Injector } from '../injector';
import { Worker } from '../types/worker';
import { Schedule } from './schedule';

@Injectable()
export class ScheduleExplorer implements OnApplicationBoot {
  constructor(
    protected readonly injector: Injector,
    protected readonly schedule: Schedule,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const workers: Worker[] = await this
      .injector
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Worker);

    workers
      .map((worker: Worker) => {
        this.schedule.add(worker);
      });
  }
}
