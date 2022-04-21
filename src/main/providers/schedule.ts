import cron from 'node-cron';
import { Injectable } from '../decorators/injectable';
import { Worker } from '../types/worker';
import { Logger } from './logger';
import { SCHEDULE_CONTEXT } from '../constants';

@Injectable()
export class Schedule {
  protected readonly workers: Worker[] = [];

  protected readonly tasks: cron.ScheduledTask[] = [];

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public register(worker: Worker): void {
    if (!cron.validate(worker.metadata.expression)) {
      throw new Error(`Invalid {${ worker.metadata.expression }} cron expression`);
    }

    this.workers.push(worker);
    this.logger.trace(`Mapped {${ worker.metadata.expression }} schedule worker`, SCHEDULE_CONTEXT);
  }

  public start(callback: () => void): void {
    for (const worker of this.workers) {
      this.tasks.push(cron.schedule(worker.metadata.expression, worker.handle.bind(worker), {
        scheduled: true,
      }));
    }

    callback();
  }

  public stop(callback: () => void): void {
    for (const worker of this.workers) {
      this.tasks.forEach(task => task.stop());
    }

    callback();
  }
}
