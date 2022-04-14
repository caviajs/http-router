import { QUEUE_CONSUMER_METADATA, QueueConsumer, QueueConsumerMetadata } from './queue-consumer';

describe('@QueueConsumer', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    class Popcorn {
      @QueueConsumer('foo')
      getPigs() {
      }
    }

    const queueConsumerMetadata: QueueConsumerMetadata = {
      name: 'foo',
    };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(QUEUE_CONSUMER_METADATA, queueConsumerMetadata, Popcorn, 'getPigs');
  });
});
