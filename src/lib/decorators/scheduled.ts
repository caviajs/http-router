export const SCHEDULED_EXPRESSION_METADATA: Symbol = Symbol('SCHEDULED_EXPRESSION_METADATA');

export function Scheduled(expression: string): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const scheduledExpressionMetadata: ScheduledExpressionMetadata = expression;

    Reflect.defineMetadata(SCHEDULED_EXPRESSION_METADATA, scheduledExpressionMetadata, target.constructor, propertyKey);
  };
}

export type ScheduledExpressionMetadata = string;
