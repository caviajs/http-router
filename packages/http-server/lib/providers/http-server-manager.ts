import { Inject, Injectable, OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '@caviajs/core';
import { Logger } from '@caviajs/logger';

import { HTTP_SERVER, HttpServer } from './http-server';
import { HttpRouter } from './http-router';
import { HTTP_SERVER_PORT, HttpServerPort } from './http-server-port';
import { LOGGER_CONTEXT } from '../http-constants';
import { Request } from '../types/request';
import { Response } from '../types/response';

@Injectable()
export class HttpServerManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  constructor(
    private readonly logger: Logger,
    private readonly httpRouter: HttpRouter,
    @Inject(HTTP_SERVER) private readonly httpServer: HttpServer,
    @Inject(HTTP_SERVER_PORT) private readonly httpServerPort: HttpServerPort,
  ) {
  }

  public onApplicationBoot(): void {
    this.httpServer.on('request', (request: Request, response: Response) => {
      this.httpRouter.handle(request, response);
    });
  }

  public onApplicationListen(): void {
    this.httpServer.listen(this.httpServerPort, () => {
      this.logger.trace(`Http server listening at port ${ this.httpServerPort }`, LOGGER_CONTEXT);
    });
  }

  public onApplicationShutdown(signal: string): void {
    this.httpServer.close(() => {
      this.logger.trace('Http server has been stopped', LOGGER_CONTEXT);
    });
  }
}
