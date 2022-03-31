import { Injectable, Injector, isTypeProvider, OnApplicationBoot, OnApplicationListen, OnApplicationShutdown, Type } from '@caviajs/core';
import { Logger } from '@caviajs/logger';
import { Schedule } from './schedule';
import { SCHEDULE_CONTEXT } from '../schedule-constants';
import { SCHEDULED_EXPRESSION_METADATA, ScheduledExpressionMetadata } from '../decorators/scheduled';

@Injectable()
export class ScheduleManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
    private readonly schedule: Schedule,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const instances: any[] = await this
      .injector
      .filter(provider => isTypeProvider(provider));

    instances
      .map(async (instance: any) => {
        const constructor: Type = instance.constructor;
        const prototype: any = Object.getPrototypeOf(instance);

        Object
          .getOwnPropertyNames(prototype)
          .filter((name: string) => {
            return Reflect.hasMetadata(SCHEDULED_EXPRESSION_METADATA, constructor, name);
          })
          .forEach((name: string) => {
            const scheduledExpressionMetadata: ScheduledExpressionMetadata = Reflect.getMetadata(SCHEDULED_EXPRESSION_METADATA, constructor, name);

            this.schedule.register(scheduledExpressionMetadata, Object.getOwnPropertyDescriptor(prototype, name).value);
          });
      });
  }

  public async onApplicationListen(): Promise<void> {
    await new Promise<void>(resolve => {
      this.schedule.start(() => resolve());
    });

    this.logger.trace('Schedule has been started', SCHEDULE_CONTEXT);
  }

  public async onApplicationShutdown(): Promise<void> {
    await new Promise<void>(resolve => {
      this.schedule.stop(() => resolve());
    });

    this.logger.trace('Schedule has been stopped', SCHEDULE_CONTEXT);
  }
}
