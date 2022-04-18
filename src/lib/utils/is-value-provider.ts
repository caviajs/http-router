import { ValueProvider } from '../types/provider';

export function isValueProvider(provider: any): provider is ValueProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('useValue');
}
