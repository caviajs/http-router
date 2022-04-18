import { Token } from '../types/token';

export function forwardRef(fn: () => Token): ForwardRef {
  return { forwardRef: fn };
}

export function isForwardRef(value: any): value is ForwardRef {
  return value !== null && typeof value === 'object' && value.hasOwnProperty('forwardRef');
}

export interface ForwardRef<T = any> {
  forwardRef: () => Token<T>;
}
