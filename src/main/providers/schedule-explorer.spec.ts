import { ScheduleExplorer } from './schedule-explorer';
import { Container } from '../container';
import { Schedule } from './schedule';
import { Worker, WorkerMetadata } from '../types/worker';
import { Injectable } from '../decorators/injectable';

@Injectable()
class FooWorker extends Worker {
  public readonly metadata: WorkerMetadata = {
    expression: '* * * * *',
  };

  public handle(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

@Injectable()
class BarWorker extends Worker {
  public readonly metadata: WorkerMetadata = {
    expression: '* * * * 5',
  };

  public handle(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

@Injectable()
class NoWorker {
}

describe('ScheduleExplorer', () => {
  const scheduleDeclareWorker = jest.fn();

  let scheduleExplorer: ScheduleExplorer;
  let fooWorker: FooWorker;
  let barWorker: BarWorker;
  let noWorker: NoWorker;

  beforeEach(async () => {
    const container: Container = await Container.create([FooWorker, BarWorker, NoWorker]);
    const schedule: Partial<Schedule> = {
      declareWorker: scheduleDeclareWorker,
    };

    scheduleExplorer = new ScheduleExplorer(container, schedule as any);
    fooWorker = await container.find(FooWorker);
    barWorker = await container.find(BarWorker);
    noWorker = await container.find(NoWorker);
  });

  describe('onApplicationBoot', () => {
    it('should add workers', async () => {
      expect(scheduleDeclareWorker).toHaveBeenCalledTimes(0);

      await scheduleExplorer.onApplicationBoot();

      expect(scheduleDeclareWorker).toHaveBeenCalledTimes(2);
      expect(scheduleDeclareWorker).toHaveBeenCalledWith(fooWorker);
      expect(scheduleDeclareWorker).toHaveBeenCalledWith(barWorker);
    });
  });
});
