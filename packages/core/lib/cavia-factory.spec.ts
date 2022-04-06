import { Application } from './decorators/application';
import { Logger } from './providers/logger';
import { CaviaApplication } from './cavia-application';
import { CaviaFactory } from './cavia-factory';
import { LOGGER_CONTEXT } from './constants';

describe('CaviaFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an exception if the class is not marked with the @Application decorator', async () => {
      class MyApp {
      }

      try {
        await CaviaFactory.create(MyApp);
      } catch (e) {
        expect(e.message).toBe(`The '${ MyApp.name }' should be annotated as an application`);
      }
    });

    it('should collect application providers', async () => {
      @Application({
        packages: [
          { providers: [{ provide: 'foo-1', useValue: 10 }] },
          { providers: [{ provide: 'foo-2', useValue: 20 }] },
        ],
        providers: [
          { provide: 'bar-1', useValue: 30 },
          { provide: 'bar-2', useValue: 40 },
        ],
      })
      class MyApp {
      }

      const application = await CaviaFactory.create(MyApp);

      expect(await application.injector.find('foo-1')).toEqual(10);
      expect(await application.injector.find('foo-2')).toEqual(20);
      expect(await application.injector.find('bar-1')).toEqual(30);
      expect(await application.injector.find('bar-2')).toEqual(40);
      expect(await application.injector.find(MyApp)).toBeInstanceOf(MyApp);
    });

    it('should determine the appropriate weighting of providers', async () => {
      @Application({
        packages: [
          { providers: [{ provide: 'foo', useValue: 1 }] },
        ],
        providers: [
          { provide: 'foo', useValue: 2 },
          { provide: 'foo', useValue: 3 },
        ],
      })
      class MyApp {
      }

      const application = await CaviaFactory.create(MyApp);

      expect(await application.injector.find('foo')).toEqual(3);
    });

    it('should use Logger', async () => {
      const loggerTraceSpy = jest.spyOn(Logger.prototype, 'trace');

      @Application()
      class MyApp {
      }

      expect(loggerTraceSpy).toHaveBeenCalledTimes(0);

      await CaviaFactory.create(MyApp);

      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, 'Starting application...', LOGGER_CONTEXT);
    });

    it('should call a boot method on the CaviaApplication instance', async () => {
      const caviaApplicationBootSpy = jest.spyOn(CaviaApplication.prototype, 'boot');

      @Application()
      class MyApp {
      }

      expect(caviaApplicationBootSpy).toHaveBeenCalledTimes(0);

      await CaviaFactory.create(MyApp);

      expect(caviaApplicationBootSpy).toHaveBeenNthCalledWith(1);
    });

    it('should return CaviaApplication instance', async () => {
      @Application()
      class MyApp {
      }

      const application = await CaviaFactory.create(MyApp);

      expect(application).toBeInstanceOf(CaviaApplication);
    });
  });
});
