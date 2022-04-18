import { schedule, ScheduledTask, validate } from 'node-cron';

export class Worker {
  protected readonly scheduledTask: ScheduledTask;

  constructor(expression: WorkerExpression, callback: WorkerCallback) {
    if (!validate(expression)) {
      throw new Error(`Invalid {${ expression }} cron expression`);
    }

    this.scheduledTask = schedule(expression, callback, { scheduled: false });
  }

  public start(): void {
    this.scheduledTask.start();
  }

  public stop(): void {
    this.scheduledTask.stop();
  }
}

export type WorkerCallback = () => void | Promise<void>;

export type WorkerExpression = string;

