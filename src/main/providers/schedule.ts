import { Injectable } from '../decorators/injectable';
import { Worker } from '../types/worker';
import { Logger } from './logger';
import { LOGGER_CONTEXT } from '../constants';

@Injectable()
export class Schedule {
  protected readonly workers: Worker[] = [];

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public register(worker: Worker): void {
    this.workers.push(worker);
    this.logger.trace(`Mapped {${ worker.metadata.expression }} schedule worker`, LOGGER_CONTEXT);
  }

  public start(callback: () => void): void {
    for (const worker of this.workers) {
      // worker.start();
    }

    callback();
  }

  public stop(callback: () => void): void {
    for (const worker of this.workers) {
      // worker.stop();
    }

    callback();
  }
}
