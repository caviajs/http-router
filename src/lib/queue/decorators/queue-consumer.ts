export const QUEUE_CONSUMER_METADATA: Symbol = Symbol('QUEUE_CONSUMER_METADATA');

export function QueueConsumer(name: string): MethodDecorator {
  return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const queueConsumerMetadata: QueueConsumerMetadata = {
      name: name,
    };

    Reflect.defineMetadata(QUEUE_CONSUMER_METADATA, queueConsumerMetadata, target.constructor, propertyKey);
  };
}

export interface QueueConsumerMetadata {
  name: string;
}
