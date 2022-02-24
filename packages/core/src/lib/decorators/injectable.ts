export const INJECTABLE_METADATA = Symbol('INJECTABLE_METADATA');

export function getInjectableMetadata(target: object): InjectableMetadata | undefined {
  return Reflect.getMetadata(INJECTABLE_METADATA, target);
}

export function hasInjectableMetadata(target: object): boolean {
  return Reflect.hasMetadata(INJECTABLE_METADATA, target);
}

export function Injectable(): ClassDecorator {
  return target => {
    const value: InjectableMetadata = true;

    Reflect.defineMetadata(INJECTABLE_METADATA, value, target);
  };
}

export type InjectableMetadata = boolean;
