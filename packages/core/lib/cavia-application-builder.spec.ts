import { Application } from './decorators/application';
import { Inject } from './decorators/inject';
import { Injectable } from './decorators/injectable';
import { Provider } from './types/provider';
import { CaviaApplicationBuilder } from './cavia-application-builder';

describe('CaviaApplicationBuilder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an exception if the class is not marked with the @Application decorator', () => {
    class MyApp {
    }

    try {
      new CaviaApplicationBuilder(MyApp);
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

    const application = await new CaviaApplicationBuilder(MyApp)
      .compile();

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

    const application = await new CaviaApplicationBuilder(MyApp)
      .compile();

    expect(await application.injector.find('foo')).toEqual(3);
  });

  describe('overrideProvider', () => {
    @Injectable()
    class Car {
      constructor(@Inject('engine') public engine: string) {
      }
    }

    const providers: Provider[] = [
      Car,
      { provide: 'engine', useValue: 'engine' },
    ];

    describe('useClass', () => {
      it('should properly override providers', async () => {
        @Injectable()
        class TestingCar {
          constructor(@Inject('engine') public engine: string) {
          }
        }

        @Injectable()
        class TestingEngine {
        }

        {
          @Application({
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.injector.find(Car)).toBeInstanceOf(TestingCar);
          expect(await application.injector.find('engine')).toBeInstanceOf(TestingEngine);
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.injector.find(Car)).toBeInstanceOf(TestingCar);
          expect(await application.injector.find('engine')).toBeInstanceOf(TestingEngine);
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.injector.find(Car)).toBeInstanceOf(TestingCar);
          expect(await application.injector.find('engine')).toBeInstanceOf(TestingEngine);
        }
      });
    });

    describe('useFactory', () => {
      it('should properly override providers', async () => {
        {
          @Application({
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.injector.find(Car)).toEqual({ engine: 'v8' });
          expect(await application.injector.find('engine')).toEqual('v8');
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.injector.find(Car)).toEqual({ engine: 'v8' });
          expect(await application.injector.find('engine')).toEqual('v8');
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.injector.find(Car)).toEqual({ engine: 'v8' });
          expect(await application.injector.find('engine')).toEqual('v8');
        }
      });
    });

    describe('useValue', () => {
      it('should properly override providers', async () => {
        {
          @Application({
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.injector.find(Car)).toEqual('BMW');
          expect(await application.injector.find('engine')).toEqual('v8');
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.injector.find(Car)).toEqual('BMW');
          expect(await application.injector.find('engine')).toEqual('v8');
        }

        {
          @Application({
            packages: [
              { providers: providers },
            ],
            providers: providers,
          })
          class MyApp {
          }

          const application = await new CaviaApplicationBuilder(MyApp)
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.injector.find(Car)).toEqual('BMW');
          expect(await application.injector.find('engine')).toEqual('v8');
        }
      });
    });
  });
});
