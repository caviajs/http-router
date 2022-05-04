import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Container } from '../container';
import { Worker } from '../types/worker';
import { Schedule } from './schedule';

@Injectable()
export class ScheduleExplorer implements OnApplicationBoot {
  constructor(
    protected readonly container: Container,
    protected readonly schedule: Schedule,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const workers: Worker[] = await this
      .container
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Worker);

    workers
      .map((worker: Worker) => {
        this.schedule.declareWorker(worker);
      });
  }
}
