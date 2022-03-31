import { SCHEDULED_METADATA, Scheduled, ScheduledMetadata } from './scheduled';

describe('@Scheduled', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    class Popcorn {
      @Scheduled('* * * * *')
      getPigs() {
      }
    }

    const scheduledMetadata: ScheduledMetadata = {
      expression: '* * * * *',
    };

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(SCHEDULED_METADATA, scheduledMetadata, Popcorn, 'getPigs');
  });
});
