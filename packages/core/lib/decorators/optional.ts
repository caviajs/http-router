export const OPTIONAL_METADATA = Symbol('OPTIONAL_METADATA');

export function getOptionalMetadata(target: object): OptionalMetadata | undefined {
  return Reflect.getMetadata(OPTIONAL_METADATA, target);
}

export function hasOptionalMetadata(target: object): boolean {
  return Reflect.hasMetadata(OPTIONAL_METADATA, target);
}

export function Optional(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const meta: OptionalMetadata = (getOptionalMetadata(target) || new Map());

    meta.set(parameterIndex, true);

    Reflect.defineMetadata(OPTIONAL_METADATA, meta, target);
  };
}

export type OptionalMetadata = Map<number, boolean>;
