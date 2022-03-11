import { INJECT_METADATA, Inject, InjectMetadata } from './inject';
import { forwardRef } from '../utils/forward-ref';

describe('@Inject', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    const baz = 'baz';
    const quz = forwardRef(() => 'quz');

    class Foo {
      constructor(
        bar: any,
        @Inject(baz) bazP: any,
        qux: any,
        @Inject(quz) quzP: any,
      ) {
      }
    }

    const metadata: InjectMetadata = new Map().set(1, baz).set(3, quz);

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenLastCalledWith(INJECT_METADATA, metadata, Foo);
  });
});
