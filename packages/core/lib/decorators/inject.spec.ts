import { INJECT_METADATA, Inject, InjectMetadata } from './inject';
import { forwardRef } from '../utils/forward-ref';

describe('@Inject', () => {
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

    const metadata: InjectMetadata = Reflect.getMetadata(INJECT_METADATA, Foo);

    expect(metadata.size).toBe(2);
    expect(metadata.get(1)).toBe(baz);
    expect(metadata.get(3)).toBe(quz);
  });
});
