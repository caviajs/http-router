import { Provider } from '../types/provider';
import { getTokenName } from './get-token-name';
import { getProviderToken } from './get-provider-token';

export function getProviderName(provider: Provider): string {
  return getTokenName(getProviderToken(provider));
}
