import { TypeProvider } from '../types/provider';

// todo dodać
// https://stackoverflow.com/questions/29093396/how-do-you-check-the-difference-between-an-ecmascript-6-class-and-function
export function isTypeProvider(provider: any): provider is TypeProvider {
  return typeof provider === 'function';
}
