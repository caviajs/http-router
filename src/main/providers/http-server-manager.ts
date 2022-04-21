import { HttpServerHandler } from './http-server-handler';
import { HTTP_SERVER, HttpServer } from './http-server';
import { HTTP_SERVER_PORT, HttpServerPort } from './http-server-port';
import { Request } from '../types/request';
import { Response } from '../types/response';
import { OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '../types/hooks';
import { Logger } from './logger';
import { Inject } from '../decorators/inject';
import { Injectable } from '../decorators/injectable';
import { HTTP_CONTEXT } from '../constants';

@Injectable()
export class HttpServerManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  constructor(
    protected readonly logger: Logger,
    @Inject(HTTP_SERVER) protected readonly httpServer: HttpServer,
    protected readonly httpServerHandler: HttpServerHandler,
    @Inject(HTTP_SERVER_PORT) protected readonly httpServerPort: HttpServerPort,
  ) {
  }

  public onApplicationBoot(): void {
    this.httpServer.on('request', (request: Request, response: Response) => {
      this.httpServerHandler.handle(request, response);
    });
  }

  public async onApplicationListen(): Promise<void> {
    await new Promise<void>(resolve => {
      this.httpServer.listen(this.httpServerPort, () => resolve());
    });

    this.logger.trace(`Http server listening at port ${ this.httpServerPort }`, HTTP_CONTEXT);
  }

  public async onApplicationShutdown(): Promise<void> {
    await new Promise<void>(resolve => {
      this.httpServer.close(() => resolve());
    });

    this.logger.trace('Http server has been stopped', HTTP_CONTEXT);
  }
}
