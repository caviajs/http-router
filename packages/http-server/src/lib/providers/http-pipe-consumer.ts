import { Injectable } from '@caviajs/core';
import { Pipe } from '../types/pipe';

@Injectable()
export class HttpPipeConsumer {
  public async apply(value: any, pipes: ApplyPipe[]): Promise<any> {
    return pipes.reduce(async (prev, curr: ApplyPipe) => curr.pipe.transform(await prev, { args: curr.args, metaType: curr.metaType }), Promise.resolve(value));
  }
}

export interface ApplyPipe {
  args: any[];
  pipe: Pipe;
  metaType: any;
}
