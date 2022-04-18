import { APPLICATION_METADATA, Application, ApplicationOptions } from './application';
import { INJECTABLE_METADATA } from './injectable';

describe('@Application', () => {
  let defineMetadataSpy: jest.SpyInstance;

  beforeEach(() => {
    defineMetadataSpy = jest.spyOn(Reflect, 'defineMetadata');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add the appropriate metadata while using decorator', () => {
    const options: ApplicationOptions = {
      packages: [
        { providers: [{ provide: 'bar', useFactory: () => 'bar' }] },
        { providers: [{ provide: 'baz', useValue: 'baz' }] },
      ],
      providers: [
        { provide: 'foo', useValue: 'foo' },
      ],
    };

    @Application(options)
    class Popcorn {
    }

    expect(defineMetadataSpy).toHaveBeenCalledTimes(2);
    expect(defineMetadataSpy).toHaveBeenCalledWith(INJECTABLE_METADATA, true, Popcorn);
    expect(defineMetadataSpy).toHaveBeenCalledWith(APPLICATION_METADATA, options, Popcorn);
  });
});
