export const INJECTABLE_METADATA = Symbol('INJECTABLE_METADATA');

export function Injectable(): ClassDecorator {
  return (target: Function) => {
    const injectableMetadata: InjectableMetadata = true;

    Reflect.defineMetadata(INJECTABLE_METADATA, injectableMetadata, target);
  };
}

export type InjectableMetadata = boolean;
