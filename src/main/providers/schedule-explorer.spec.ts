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
  const scheduleRegister = jest.fn();

  let scheduleExplorer: ScheduleExplorer;
  let fooWorker: FooWorker;
  let barWorker: BarWorker;
  let noWorker: NoWorker;

  beforeEach(async () => {
    const injector: Injector = await Injector.create([FooWorker, BarWorker, NoWorker]);
    const schedule: Partial<Schedule> = {
      register: scheduleRegister,
    };

    scheduleExplorer = new ScheduleExplorer(injector, schedule as any);
    fooWorker = await injector.find(FooWorker);
    barWorker = await injector.find(BarWorker);
    noWorker = await injector.find(NoWorker);
  });

  describe('onApplicationBoot', () => {
    it('should register workers', async () => {
      expect(scheduleRegister).toHaveBeenCalledTimes(0);

      await scheduleExplorer.onApplicationBoot();

      expect(scheduleRegister).toHaveBeenCalledTimes(2);
      expect(scheduleRegister).toHaveBeenCalledWith(fooWorker);
      expect(scheduleRegister).toHaveBeenCalledWith(barWorker);
    });
  });
});
