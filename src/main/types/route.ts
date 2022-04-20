import { Method } from './method';
import { Path } from './path';
import { Request } from './request';
import { Response } from './response';
import { Type } from './type';
import { Interceptor } from './interceptor';
import { Schema } from './schema';

export abstract class Route {
  public abstract readonly metadata: RouteMetadata;

  public abstract handle(request: Request, response: Response): unknown;
}

export interface RouteMetadata {
  readonly data?: any;
  readonly interceptors?: RouteMetadataInterceptor[];
  readonly method: Method;
  readonly path: Path;
  readonly schema?: RouteMetadataSchema;
}

export interface RouteMetadataInterceptor {
  args: any[];
  interceptor: Type<Interceptor>;
}

export interface RouteMetadataSchema {
  request?: {
    body?: Schema;
    cookies?: Schema;
    headers?: Schema;
    params?: Schema;
    query?: Schema;
  };
  responses?: {
    [status: number]: {
      content?: {
        [mimeType: string]: {
          body?: Schema;
          headers?: Schema;
        };
      };
      description?: string;
    };
  };
}
