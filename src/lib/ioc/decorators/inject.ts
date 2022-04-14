import { Token } from '../types/token';
import { ForwardRef } from '../utils/forward-ref';

export const INJECT_METADATA = Symbol('INJECT_METADATA');

export function Inject(tokenOrForwardRef: Token | ForwardRef): ParameterDecorator {
  return (target: Function, propertyKey: string, parameterIndex: number) => {
    const injectMetadata: InjectMetadata = (Reflect.getMetadata(INJECT_METADATA, target) || new Map());

    injectMetadata.set(parameterIndex, tokenOrForwardRef);

    Reflect.defineMetadata(INJECT_METADATA, injectMetadata, target);
  };
}

export type InjectMetadata = Map<number, Token | ForwardRef>;
