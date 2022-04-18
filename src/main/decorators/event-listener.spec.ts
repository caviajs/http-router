import { EVENT_LISTENER_METADATA, EventListener, EventListenerMetadata } from './event-listener';

describe('@EventListener', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    class Popcorn {
      @EventListener('foo')
      getPigs() {
      }
    }

    const eventListenerMetadata: EventListenerMetadata = {
      event: 'foo',
    };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(EVENT_LISTENER_METADATA, eventListenerMetadata, Popcorn, 'getPigs');
  });
});
