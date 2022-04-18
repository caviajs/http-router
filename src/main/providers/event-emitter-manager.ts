import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Injector } from '../injector';
import { isTypeProvider } from '../utils/is-type-provider';
import { Type } from '../types/type';
import { EVENT_LISTENER_METADATA, EventListenerMetadata } from '../decorators/event-listener';
import { EventEmitter } from './event-emitter';

@Injectable()
export class EventEmitterManager implements OnApplicationBoot {
  constructor(
    protected readonly eventEmitter: EventEmitter,
    protected readonly injector: Injector,
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
            return Reflect.hasMetadata(EVENT_LISTENER_METADATA, constructor, name);
          })
          .forEach((name: string) => {
            const eventListenerMetadata: EventListenerMetadata = Reflect.getMetadata(EVENT_LISTENER_METADATA, constructor, name);

            this
              .eventEmitter
              .listen(eventListenerMetadata.event, Object.getOwnPropertyDescriptor(prototype, name).value.bind(instance));
          });
      });
  }
}
