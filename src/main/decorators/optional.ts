export const OPTIONAL_METADATA = Symbol('OPTIONAL_METADATA');

export function Optional(): ParameterDecorator {
  return (target: Function, propertyKey: string, parameterIndex: number) => {
    const optionalMetadata: OptionalMetadata = (Reflect.getMetadata(OPTIONAL_METADATA, target) || new Map());

    optionalMetadata.set(parameterIndex, true);

    Reflect.defineMetadata(OPTIONAL_METADATA, optionalMetadata, target);
  };
}

export type OptionalMetadata = Map<number, boolean>;
