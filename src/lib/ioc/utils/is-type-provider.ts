import { TypeProvider } from '../types/provider';

export function isTypeProvider(provider: any): provider is TypeProvider {
  return provider !== null && typeof provider === 'function' && /^class\s/.test(Function.prototype.toString.call(provider));
}
