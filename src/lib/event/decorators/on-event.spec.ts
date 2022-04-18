import { ON_EVENT_METADATA, OnEvent, OnEventMetadata } from './on-event';

describe('@OnEvent', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    class Popcorn {
      @OnEvent('foo')
      getPigs() {
      }
    }

    const onEventMetadata: OnEventMetadata = {
      event: 'foo',
    };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(ON_EVENT_METADATA, onEventMetadata, Popcorn, 'getPigs');
  });
});
