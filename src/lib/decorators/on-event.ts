export const ON_EVENT_METADATA: Symbol = Symbol('ON_EVENT_METADATA');

export function OnEvent(event: string): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const onEventMetadata: OnEventMetadata = {
      event: event,
    };

    Reflect.defineMetadata(ON_EVENT_METADATA, onEventMetadata, target.constructor, propertyKey);
  };
}

export interface OnEventMetadata {
  event: string;
}
