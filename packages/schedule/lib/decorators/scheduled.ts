export const SCHEDULED_METADATA: Symbol = Symbol('SCHEDULED_METADATA');

export function Scheduled(expression: string): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const scheduledMetadata: ScheduledMetadata = {
      expression: expression,
    };

    Reflect.defineMetadata(SCHEDULED_METADATA, scheduledMetadata, target.constructor, propertyKey);
  };
}

export interface ScheduledMetadata {
  expression: string;
}
