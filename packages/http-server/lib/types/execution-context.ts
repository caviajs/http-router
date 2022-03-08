import { Type } from '@caviajs/core';
import { Request } from './request';
import { Response } from './response';

export interface ExecutionContext {
  getArgs(): any[];

  getClass(): Type;

  getHandler(): Function;

  getRequest(): Request;

  getResponse(): Response;
}
