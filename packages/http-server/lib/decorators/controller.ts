import { Injectable } from '@caviajs/core';
import { HttpReflector } from '../http-reflector';

const DEFAULT_PREFIX: string = '/';

export function Controller(prefix?: string): ClassDecorator {
  return target => {
    HttpReflector.addControllerMetadata(target, {
      prefix: prefix || DEFAULT_PREFIX,
    });

    Reflect.decorate([Injectable()], target);
  };
}
