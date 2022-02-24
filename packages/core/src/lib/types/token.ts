import { Type } from './type';

export type Token<T = any> = string | symbol | Type<T>;
