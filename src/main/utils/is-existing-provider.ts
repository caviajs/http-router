import { ExistingProvider } from '../types/provider';

export function isExistingProvider(provider: any): provider is ExistingProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('useExisting');
}
