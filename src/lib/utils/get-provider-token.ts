import { Provider } from '../types/provider';
import { Token } from '../types/token';
import { isTypeProvider } from './is-type-provider';

export function getProviderToken(provider: Provider): Token {
  return isTypeProvider(provider) ? provider : provider.provide;
}
