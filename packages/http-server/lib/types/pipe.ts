import { Type } from '@caviajs/core';
import { Request } from './request';
import { Response } from './response';

export interface Pipe {
  transform(context: PipeContext): any;
}

export interface PipeContext {
  getClass(): Type;

  getHandler(): Function;

  getMetaType(): Function;

  getRequest(): Request;

  getResponse(): Response;

  getValue(): any;
}
