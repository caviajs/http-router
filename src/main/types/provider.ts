import { Token } from './token';
import { Type } from './type';

export interface ClassProvider<T = any> {
  provide: Token;
  useClass: Type<T>;
}

export interface Dependency {
  dependency: Token;
  optional: boolean;
}

export interface ExistingProvider<T = any> {
  provide: Token;
  useExisting: Token<T>;
}

export interface FactoryProvider<T = any> {
  dependencies?: (Token | Dependency)[];
  provide: Token;
  useFactory: (...deps: any[]) => T;
}

export interface TypeProvider<T = any> {
  new(...args: any): T;
}

export interface ValueProvider<T = any> {
  provide: Token;
  useValue: T;
}

export type Provider<T = any> =
  ClassProvider<T>
  | ExistingProvider<T>
  | FactoryProvider<T>
  | TypeProvider<T>
  | ValueProvider<T>;
