export const EVENT_LISTENER_METADATA: Symbol = Symbol('ON_EVENT_METADATA');

export function EventListener(event: string): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const eventListenerMetadata: EventListenerMetadata = {
      event: event,
    };

    Reflect.defineMetadata(EVENT_LISTENER_METADATA, eventListenerMetadata, target.constructor, propertyKey);
  };
}

export interface EventListenerMetadata {
  event: string;
}
