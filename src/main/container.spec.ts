import { Inject } from './decorators/inject';
import { Injectable } from './decorators/injectable';
import { Optional } from './decorators/optional';
import { Container } from './container';
import { Token } from './types/token';
import { forwardRef } from './utils/forward-ref';
import { getProviderToken } from './utils/get-provider-token';
import { getTokenName } from './utils/get-token-name';

class CarWithoutInjectableAnnotation {
}

@Injectable()
class Engine {
}

@Injectable()
class Car {
  constructor(public engine: Engine) {
  }
}

@Injectable()
class CarWithUnknownEngine {
  constructor(public engine: any) {
  }
}

@Injectable()
class CarWithOptionalEngine {
  constructor(@Optional() public engine: Engine) {
  }
}

@Injectable()
class CarWithInjectEngine {
  constructor(@Inject(Engine) public engine: any) {
  }
}

@Injectable()
class CarWithInjectEngineByForwardRef {
  constructor(@Inject(forwardRef(() => Engine)) public engine: any) {
  }
}

@Injectable()
class CarWithOptionalInjectEngine {
  constructor(@Optional() @Inject(Engine) public engine: any) {
  }
}

@Injectable()
class CarWithOptionalInjectEngineByForwardRef {
  constructor(@Optional() @Inject(forwardRef(() => Engine)) public engine: any) {
  }
}

describe('Container', () => {
  it('should contain built-in Container dependency', async () => {
    const container = await Container.create([]);

    expect(await container.find(Container)).toBe(container);
  });

  it('should correctly resolve the same provider by priority', async () => {
    const container = await Container.create([
      { provide: 'foo', useValue: 1 },
      { provide: 'foo', useValue: 2 },
    ]);

    expect(await container.find('foo')).toEqual(1);
  });

  describe('filter', () => {
    it('should return properly filtered providers using predicate', async () => {
      const container = await Container.create([
        { provide: 'foo', useValue: 1 },
        { provide: 'bar', useValue: 2 },
        { provide: 'baz', useValue: 3 },
      ]);

      const result: any[] = await container.filter(provider => {
        const tokens: Token[] = ['foo', 'bar'];

        return tokens.includes(getProviderToken(provider));
      });

      expect(result.length).toEqual(2);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).not.toContain(3);
    });

    it('should return properly filtered providers using tokens', async () => {
      const container = await Container.create([
        { provide: 'foo', useValue: 1 },
        { provide: 'bar', useValue: 2 },
        { provide: 'baz', useValue: 3 },
      ]);

      const result: any[] = await container.filter(['foo', 'bar']);

      expect(result.length).toEqual(2);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).not.toContain(3);
    });
  });

  describe('find', () => {
    it('should return the found provider using token', async () => {
      const container = await Container.create([
        { provide: 'foo', useValue: 1 },
      ]);

      expect(await container.find('foo')).toBe(1);
    });

    it('should return undefined if the provider is not found using token', async () => {
      const container = await Container.create([]);

      expect(await container.find('foo')).toBeUndefined();
    });

    it('should return the found provider using predicate', async () => {
      const container = await Container.create([
        { provide: 'foo', useValue: 1 },
      ]);

      expect(await container.find(provider => getProviderToken(provider) === 'foo')).toBe(1);
    });

    it('should return undefined if the provider is not found using predicate', async () => {
      const container = await Container.create([]);

      expect(await container.find(provider => getProviderToken(provider) === 'foo')).toBeUndefined();
    });
  });

  describe('using class providers', () => {
    it('should throw an exception if the class does not have the Injection annotation', () => {
      expect(Container.create([{ provide: 'car', useClass: CarWithoutInjectableAnnotation }]))
        .rejects
        .toThrowError(`The '${ getTokenName(CarWithoutInjectableAnnotation) }' should be annotated as a injectable`);
    });

    it('should correctly resolve class without dependencies', async () => {
      const container = await Container.create([{ provide: 'engine', useClass: Engine }]);

      expect(await container.find('engine')).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with reference dependency', async () => {
      const container = await Container.create([Engine, { provide: 'car', useClass: Car }]);
      const car = await container.find<Car>('car');

      expect(car).toBeInstanceOf(Car);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class injects a nonexistent reference dependency', () => {
      expect(Container.create([{ provide: 'car', useClass: Car }]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName(Car) }`);
    });

    it('should throw an exception if the class injects an unknown reference dependency', () => {
      expect(Container.create([{ provide: 'car', useClass: CarWithUnknownEngine }]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName(CarWithUnknownEngine) }`);
    });

    it('should correctly resolve class with reference optional dependency', async () => {
      const container = await Container.create([Engine, { provide: 'car', useClass: CarWithOptionalEngine }]);
      const car = await container.find<CarWithOptionalEngine>('car');

      expect(car).toBeInstanceOf(CarWithOptionalEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with reference optional nonexistent dependency', async () => {
      const container = await Container.create([{ provide: 'car', useClass: CarWithOptionalEngine }]);
      const car = await container.find<CarWithOptionalEngine>('car');

      expect(car).toBeInstanceOf(CarWithOptionalEngine);
      expect(car.engine).toBeUndefined();
    });

    it('should correctly resolve class with dependency by Inject annotation', async () => {
      const container = await Container.create([Engine, { provide: 'car', useClass: CarWithInjectEngine }]);
      const car = await container.find<CarWithInjectEngine>('car');

      expect(car).toBeInstanceOf(CarWithInjectEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class inject nonexistent dependency by Inject annotation', () => {
      expect(Container.create([{ provide: 'car', useClass: CarWithInjectEngine }]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName(CarWithInjectEngine) }`);
    });

    it('should correctly resolve class with dependency by Inject annotation and forwardRef', async () => {
      const container = await Container.create([Engine, { provide: 'car', useClass: CarWithInjectEngineByForwardRef }]);
      const car = await container.find<CarWithInjectEngineByForwardRef>('car');

      expect(car).toBeInstanceOf(CarWithInjectEngineByForwardRef);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class inject nonexistent dependency by Inject annotation and forwardRef', () => {
      expect(Container.create([{ provide: 'car', useClass: CarWithInjectEngineByForwardRef }]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName(CarWithInjectEngineByForwardRef) }`);
    });

    it('should correctly resolve class with optional dependency by Inject annotation', async () => {
      const container = await Container.create([Engine, { provide: 'car', useClass: CarWithOptionalInjectEngine }]);
      const car = await container.find<CarWithOptionalInjectEngine>('car');

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with optional nonexistent dependency by Inject annotation', async () => {
      const container = await Container.create([{ provide: 'car', useClass: CarWithOptionalInjectEngine }]);
      const car = await container.find<CarWithOptionalInjectEngine>('car');

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngine);
      expect(car.engine).toBeUndefined();
    });

    it('should correctly resolve class with optional dependency by Inject annotation and forwardRef', async () => {
      const container = await Container.create([Engine, { provide: 'car', useClass: CarWithOptionalInjectEngineByForwardRef }]);
      const car = await container.find<CarWithOptionalInjectEngineByForwardRef>('car');

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngineByForwardRef);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with optional nonexistent dependency by Inject annotation and forwardRef', async () => {
      const container = await Container.create([{ provide: 'car', useClass: CarWithOptionalInjectEngineByForwardRef }]);
      const car = await container.find<CarWithOptionalInjectEngineByForwardRef>('car');

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngineByForwardRef);
      expect(car.engine).toBeUndefined();
    });
  });

  describe('using factory providers', () => {
    it('should correctly resolve provider without dependencies', async () => {
      const container = await Container.create([
        { provide: 'car', useFactory: () => 'foo' },
      ]);

      expect(await container.find('car')).toEqual('foo');
    });

    it('should correctly resolve async provider without dependencies', async () => {
      const container = await Container.create([
        { provide: 'car', useFactory: () => new Promise(resolve => setTimeout(() => resolve('foo'), 10)) },
      ]);

      expect(await container.find('car')).toEqual('foo');
    });

    it('should correctly resolve provider with dependency', async () => {
      const container = await Container.create([
        Engine,
        { provide: 'car1', useFactory: engine => ({ engine }), dependencies: [Engine] },
        { provide: 'car2', useFactory: engine => ({ engine }), dependencies: [{ dependency: Engine, optional: false }] },
      ]);

      const car1 = await container.find<{ engine: Engine }>('car1');
      const car2 = await container.find<{ engine: Engine }>('car2');

      expect(car1.engine).toBeInstanceOf(Engine);
      expect(car2.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve provider with optional dependency', async () => {
      const container = await Container.create([
        Engine,
        { provide: 'car', useFactory: engine => ({ engine }), dependencies: [{ dependency: Engine, optional: true }] },
      ]);
      const car = await container.find<{ engine: Engine }>('car');

      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve provider with nonexistent optional dependency', async () => {
      const container = await Container.create([
        { provide: 'car', useFactory: engine => ({ engine }), dependencies: [{ dependency: Engine, optional: true }] },
      ]);
      const car = await container.find<{ engine: Engine }>('car');

      expect(car.engine).toBeUndefined();
    });

    it('should throw an exception if the provider injects a nonexistent dependency', () => {
      expect(Container.create([{ provide: 'car', useFactory: engine => ({ engine }), dependencies: [Engine] }]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName('car') }`);

      expect(Container.create([{ provide: 'car', useFactory: engine => ({ engine }), dependencies: [{ dependency: Engine, optional: false }] }]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName('car') }`);
    });
  });

  describe('using type providers', () => {
    it('should throw an exception if the class does not have the Injection annotation', () => {
      expect(Container.create([CarWithoutInjectableAnnotation]))
        .rejects
        .toThrowError(`The '${ getTokenName(CarWithoutInjectableAnnotation) }' should be annotated as a injectable`);
    });

    it('should correctly resolve class without dependencies', async () => {
      const container = await Container.create([Engine]);

      expect(await container.find(Engine)).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with reference dependency', async () => {
      const container = await Container.create([Engine, Car]);
      const car = await container.find<Car>(Car);

      expect(car).toBeInstanceOf(Car);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class injects a nonexistent reference dependency', () => {
      expect(Container.create([Car]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName(Car) }`);
    });

    it('should throw an exception if the class injects an unknown reference dependency', () => {
      expect(Container.create([CarWithUnknownEngine]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName(CarWithUnknownEngine) }`);
    });

    it('should correctly resolve class with reference optional dependency', async () => {
      const container = await Container.create([Engine, CarWithOptionalEngine]);
      const car = await container.find<CarWithOptionalEngine>(CarWithOptionalEngine);

      expect(car).toBeInstanceOf(CarWithOptionalEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with reference optional nonexistent dependency', async () => {
      const container = await Container.create([CarWithOptionalEngine]);
      const car = await container.find<CarWithOptionalEngine>(CarWithOptionalEngine);

      expect(car).toBeInstanceOf(CarWithOptionalEngine);
      expect(car.engine).toBeUndefined();
    });

    it('should correctly resolve class with dependency by Inject annotation', async () => {
      const container = await Container.create([Engine, CarWithInjectEngine]);
      const car = await container.find<CarWithInjectEngine>(CarWithInjectEngine);

      expect(car).toBeInstanceOf(CarWithInjectEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class inject nonexistent dependency by Inject annotation', () => {
      expect(Container.create([CarWithInjectEngine]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName(CarWithInjectEngine) }`);
    });

    it('should correctly resolve class with dependency by Inject annotation and forwardRef', async () => {
      const container = await Container.create([Engine, CarWithInjectEngineByForwardRef]);
      const car = await container.find<CarWithInjectEngineByForwardRef>(CarWithInjectEngineByForwardRef);

      expect(car).toBeInstanceOf(CarWithInjectEngineByForwardRef);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class inject nonexistent dependency by Inject annotation and forwardRef', () => {
      expect(Container.create([CarWithInjectEngineByForwardRef]))
        .rejects
        .toThrowError(`Cavia can't resolve dependency at index [0] in ${ getTokenName(CarWithInjectEngineByForwardRef) }`);
    });

    it('should correctly resolve class with optional dependency by Inject annotation', async () => {
      const container = await Container.create([Engine, CarWithOptionalInjectEngine]);
      const car = await container.find<CarWithOptionalInjectEngine>(CarWithOptionalInjectEngine);

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with optional nonexistent dependency by Inject annotation', async () => {
      const container = await Container.create([CarWithOptionalInjectEngine]);
      const car = await container.find<CarWithOptionalInjectEngine>(CarWithOptionalInjectEngine);

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngine);
      expect(car.engine).toBeUndefined();
    });

    it('should correctly resolve class with optional dependency by Inject annotation and forwardRef', async () => {
      const container = await Container.create([Engine, CarWithOptionalInjectEngineByForwardRef]);
      const car = await container.find<CarWithOptionalInjectEngineByForwardRef>(CarWithOptionalInjectEngineByForwardRef);

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngineByForwardRef);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with optional nonexistent dependency by Inject annotation and forwardRef', async () => {
      const container = await Container.create([CarWithOptionalInjectEngineByForwardRef]);
      const car = await container.find<CarWithOptionalInjectEngineByForwardRef>(CarWithOptionalInjectEngineByForwardRef);

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngineByForwardRef);
      expect(car.engine).toBeUndefined();
    });
  });

  describe('using value providers', () => {
    it('should correctly resolve provider', async () => {
      const container = await Container.create([
        { provide: 'engine', useValue: 'v8' },
      ]);

      expect(await container.find('engine')).toEqual('v8');
    });
  });

  describe('using invalid providers', () => {
    it('should throw an exception if invalid provider passed', () => {
      const provider: any = {};

      expect(Container.create([provider])).rejects.toThrowError(`Invalid provider '${ provider }'`);
    });
  });
});
