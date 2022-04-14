import { Schedule } from './schedule';
import { SCHEDULED_EXPRESSION_METADATA, ScheduledExpressionMetadata } from '../decorators/scheduled';
import { LOGGER_CONTEXT } from '../../constants';
import { OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '../../runtime/types/hooks';
import { Injector } from '../../ioc/injector';
import { Logger } from '../../logger/providers/logger';
import { Injectable } from '../../ioc/decorators/injectable';
import { isTypeProvider } from '../../ioc/utils/is-type-provider';
import { Type } from '../../ioc/types/type';

@Injectable()
export class ScheduleManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  constructor(
    protected readonly injector: Injector,
    protected readonly logger: Logger,
    protected readonly schedule: Schedule,
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

            this.schedule.register(scheduledExpressionMetadata, Object.getOwnPropertyDescriptor(prototype, name).value.bind(instance));
          });
      });
  }

  public async onApplicationListen(): Promise<void> {
    await new Promise<void>(resolve => {
      this.schedule.start(() => resolve());
    });

    this.logger.trace('Schedule has been started', LOGGER_CONTEXT);
  }

  public async onApplicationShutdown(): Promise<void> {
    await new Promise<void>(resolve => {
      this.schedule.stop(() => resolve());
    });

    this.logger.trace('Schedule has been stopped', LOGGER_CONTEXT);
  }
}
