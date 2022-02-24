import { Token } from '../types/token';
import { isTypeProvider } from './is-type-provider';

export function getTokenName(token: Token): string {
  return isTypeProvider(token) ? token.name : token.toString();
}
