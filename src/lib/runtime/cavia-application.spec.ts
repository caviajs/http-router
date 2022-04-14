import { Injectable } from '../ioc/decorators/injectable';
import { OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from './types/hooks';
import { CaviaApplication } from './cavia-application';
import { Injector } from '../ioc/injector';

@Injectable()
class Foo implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  onApplicationBoot(): void {
  }

  onApplicationListen(): void {
  }

  onApplicationShutdown(signal?: string): void {
  }
}

@Injectable()
class Bar implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  onApplicationBoot(): void {
  }

  onApplicationListen(): void {
  }

  onApplicationShutdown(signal?: string): void {
  }
}

describe('CaviaApplication', () => {
  let caviaApplication: CaviaApplication;

  beforeEach(async () => {
    caviaApplication = new CaviaApplication(await Injector.create([Foo, Bar]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('boot', () => {
    it('should execute the onApplicationBoot lifecycle for each provider', async () => {
      const fooOnApplicationBootSpy = jest.spyOn(Foo.prototype, 'onApplicationBoot');
      const barOnApplicationBootSpy = jest.spyOn(Bar.prototype, 'onApplicationBoot');

      await caviaApplication.boot();

      expect(fooOnApplicationBootSpy).toHaveBeenNthCalledWith(1);
      expect(barOnApplicationBootSpy).toHaveBeenNthCalledWith(1);
    });
  });

  describe('listen', () => {
    it('should execute the onApplicationListen lifecycle for each provider', async () => {
      const fooOnApplicationListenSpy = jest.spyOn(Foo.prototype, 'onApplicationListen');
      const barOnApplicationListenSpy = jest.spyOn(Bar.prototype, 'onApplicationListen');

      await caviaApplication.listen();

      expect(fooOnApplicationListenSpy).toHaveBeenNthCalledWith(1);
      expect(barOnApplicationListenSpy).toHaveBeenNthCalledWith(1);
    });
  });

  describe('shutdown', () => {
    it('should execute the onApplicationShutdown lifecycle for each provider', async () => {
      const fooOnApplicationShutdownSpy = jest.spyOn(Foo.prototype, 'onApplicationShutdown');
      const barOnApplicationShutdownSpy = jest.spyOn(Bar.prototype, 'onApplicationShutdown');

      await caviaApplication.shutdown('SIGINT');

      expect(fooOnApplicationShutdownSpy).toHaveBeenNthCalledWith(1, 'SIGINT');
      expect(barOnApplicationShutdownSpy).toHaveBeenNthCalledWith(1, 'SIGINT');
    });
  });
});
