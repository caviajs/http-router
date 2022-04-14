import { Worker } from '../adapters/worker';
import { LOGGER_CONTEXT } from '../../constants';
import { Logger } from '../../logger/providers/logger';
import { Injectable } from '../../ioc/decorators/injectable';

@Injectable()
export class Schedule {
  protected readonly workers: Worker[] = [];

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  public register(expression: string, callback: () => void | Promise<void>): void {
    this.workers.push(new Worker(expression, callback));
    this.logger.trace(`Mapped {${ expression }} schedule worker`, LOGGER_CONTEXT);
  }

  public start(callback: () => void): void {
    for (const worker of this.workers) {
      worker.start();
    }

    callback();
  }

  public stop(callback: () => void): void {
    for (const worker of this.workers) {
      worker.stop();
    }

    callback();
  }
}
