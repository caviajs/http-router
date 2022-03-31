import { SCHEDULED_EXPRESSION_METADATA, Scheduled, ScheduledExpressionMetadata } from './scheduled';

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

    const scheduledExpressionMetadata: ScheduledExpressionMetadata = '* * * * *';

    expect(defineMetadataSpy).toHaveBeenCalledTimes(1);
    expect(defineMetadataSpy).toHaveBeenCalledWith(SCHEDULED_EXPRESSION_METADATA, scheduledExpressionMetadata, Popcorn, 'getPigs');
  });
});
