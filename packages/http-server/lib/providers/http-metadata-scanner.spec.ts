import { Injectable, Injector } from '@caviajs/core';
import { Logger, LoggerLevel } from '@caviajs/logger';
import { Controller } from '../decorators/controller';
import { Get } from '../decorators/route-mapping-get';
import { Post } from '../decorators/route-mapping-post';
import { HttpMetadataScanner } from './http-metadata-scanner';
import { HttpRouter } from './http-router';
import { Interceptor } from '../types/interceptor';
import { Pipe } from '../types/pipe';
import { Body } from '../decorators/route-param-body';
import { UseInterceptor } from '../decorators/use-interceptor';

@Injectable()
class AuthInterceptor implements Interceptor {
  intercept(context, next) {
    return next.handle();
  }
}

@Injectable()
class ValidatePipe implements Pipe {
  transform(value, metadata) {
    return value;
  }
}

@Controller('foo')
class FooController {
  @UseInterceptor(AuthInterceptor, ['admin:foo:get'])
  @Get()
  public getFoo(@Body() body) {
  }

  @UseInterceptor(AuthInterceptor, ['admin:foo:create'])
  @Post('create')
  public postFoo() {
  }
}

@UseInterceptor(AuthInterceptor, ['admin:bar'])
@Controller('bar')
class BarController {
  @Get()
  public getBar() {
  }
}

describe('HttpMetadataScanner', () => {
  let logger: Logger;
  let injector: Injector;
  let httpRouter: HttpRouter;
  let httpMetadataScanner: HttpMetadataScanner;

  beforeAll(async () => {
    logger = new Logger(LoggerLevel.ALL, () => '');
    injector = await Injector.create([AuthInterceptor, ValidatePipe, FooController, BarController]);

    httpRouter = new HttpRouter(logger);
    httpMetadataScanner = new HttpMetadataScanner(httpRouter, injector);
  });

  it('lorem', () => {
    expect(1).toEqual(1);
  });
});
