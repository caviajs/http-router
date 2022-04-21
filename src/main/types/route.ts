import { Method } from './method';
import { Path } from './path';
import { Request } from './request';
import { Response } from './response';
import { Schema } from './schema';

export abstract class Route {
  public abstract readonly metadata: RouteMetadata;

  public abstract handle(request: Request, response: Response): unknown;
}

export interface RouteMetadata {
  readonly data?: any;
  readonly method: Method;
  readonly path: Path;
  readonly schema?: {
    readonly request?: {
      readonly body?: Schema;
      readonly cookies?: Schema;
      readonly headers?: Schema;
      readonly params?: Schema;
      readonly query?: Schema;
    };
    readonly responses?: {
      readonly [status: number]: {
        readonly content?: {
          readonly [mimeType: string]: {
            readonly body?: Schema;
            readonly headers?: Schema;
          };
        };
        readonly description?: string;
      };
    };
  };
}
