import { Injectable, Type } from '@caviajs/core';

import { ControllerMetadata, getControllerMetadata } from '../decorators/controller';

@Injectable()
export class HttpMetadataAccessor {
  public getControllerMetadata(target: Type): ControllerMetadata | undefined {
    return getControllerMetadata(target);
  }

  public getRequestParamMetaType(target: any, index: number): any {
    return (Reflect.getMetadata('design:paramtypes', target) || [])[index];
  }
}
