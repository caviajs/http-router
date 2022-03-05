import { ClassProvider } from '../types/provider';

export function isClassProvider(provider: any): provider is ClassProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('useClass');
}
