import { Inject, Injectable, OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '@caviajs/core';
import { Logger } from '@caviajs/logger';
import { HttpServerHandler } from './http-server-handler';
import { HTTP_SERVER, HttpServer } from './http-server';
import { HTTP_SERVER_PORT, HttpServerPort } from './http-server-port';
import { LOGGER_CONTEXT } from '../http-constants';

@Injectable()
export class HttpServerManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  constructor(
    private readonly logger: Logger,
    @Inject(HTTP_SERVER) private readonly httpServer: HttpServer,
    private readonly httpServerHandler: HttpServerHandler,
    @Inject(HTTP_SERVER_PORT) private readonly httpServerPort: HttpServerPort,
  ) {
  }

  public onApplicationBoot(): void {
    this.httpServer.on('request', this.httpServerHandler.handle);
  }

  public onApplicationListen(): void {
    this.httpServer.listen(this.httpServerPort, () => {
      this.logger.trace(`Http server listening at port ${ this.httpServerPort }`, LOGGER_CONTEXT);
    });
  }

  public onApplicationShutdown(): void {
    this.httpServer.close(() => {
      this.logger.trace('Http server has been stopped', LOGGER_CONTEXT);
    });
  }
}
