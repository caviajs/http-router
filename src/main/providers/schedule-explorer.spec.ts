import { ScheduleExplorer } from './schedule-explorer';
import { Injector } from '../injector';
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
    const injector: Injector = await Injector.create([FooWorker, BarWorker, NoWorker]);
    const schedule: Partial<Schedule> = {
      declareWorker: scheduleDeclareWorker,
    };

    scheduleExplorer = new ScheduleExplorer(injector, schedule as any);
    fooWorker = await injector.find(FooWorker);
    barWorker = await injector.find(BarWorker);
    noWorker = await injector.find(NoWorker);
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
