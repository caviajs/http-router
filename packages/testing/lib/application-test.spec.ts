import { Application, Injectable, Package } from '@caviajs/core';
import { LOGGER_LEVEL, LoggerLevel, LoggerPackage } from '@caviajs/logger';
import { ApplicationTest } from './application-test';

@Injectable()
class FooService {
  public foo(): any {
    return 'foo';
  }
}

const FooPackage: Package = {
  providers: [FooService],
};

@Injectable()
class BarService {
  public bar(): any {
    return 'bar';
  }
}

@Application({
  packages: [
    LoggerPackage.configure().register(),
    FooPackage,
  ],
  providers: [
    BarService,
  ],
})
class App {
}

describe('ApplicationTest', () => {
  it('should disable the logger by default', async () => {
    const app = await ApplicationTest.configureTestingApplication(App).compile();
    const loggerLevel = await app.injector.find(LOGGER_LEVEL);

    expect(loggerLevel).toEqual(LoggerLevel.OFF);
  });

  describe('package providers', () => {
  });

  describe('providers providers', () => {
    it('useClass ', async () => {
      @Injectable()
      class TestBarService {
        public bar() {
          return 'popcorn!';
        }
      }

      const app = await ApplicationTest
        .configureTestingApplication(App)
        .overrideProvider(BarService)
        .useClass(TestBarService)
        .compile();
      const myAppService = await app.injector.find(BarService);

      expect(myAppService.bar()).toEqual('popcorn!');
    });

    it('useFactory', async () => {
    });

    it('useValue', async () => {
    });
  });
});
