import { schedule, ScheduledTask } from 'node-cron';

export class Worker {
  protected readonly scheduledTask: ScheduledTask;

  constructor(expression: WorkerExpression, callback: WorkerCallback) {
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

