import { Type } from '@caviajs/core';

export interface Pipe {
  transform(value: any, metadata: PipeMetadata): any;
}

export interface PipeMetadata {
  args: any[];
  metaType: Type | undefined;
}
