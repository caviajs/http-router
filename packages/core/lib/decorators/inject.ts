import { Token } from '../types/token';
import { ForwardRef } from '../utils/forward-ref';

export const INJECT_METADATA = Symbol('INJECT_METADATA');

export function getInjectMetadata(target: object): InjectMetadata | undefined {
  return Reflect.getMetadata(INJECT_METADATA, target);
}

export function hasInjectMetadata(target: object): boolean {
  return Reflect.hasMetadata(INJECT_METADATA, target);
}

export function Inject(tokenOrForwardRef: Token | ForwardRef): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const injectMetadata: InjectMetadata = (getInjectMetadata(target) || new Map());

    injectMetadata.set(parameterIndex, tokenOrForwardRef);

    Reflect.defineMetadata(INJECT_METADATA, injectMetadata, target);
  };
}

export type InjectMetadata = Map<number, Token | ForwardRef>;
