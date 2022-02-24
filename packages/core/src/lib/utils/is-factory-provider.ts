import { FactoryProvider } from '../types/provider';

export function isFactoryProvider(provider: any): provider is FactoryProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('useFactory');
}
