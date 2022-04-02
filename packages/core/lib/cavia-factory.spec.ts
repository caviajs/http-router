import { Application } from './decorators/application';
import { CaviaApplication } from './cavia-application';
import { CaviaApplicationBuilder } from './cavia-application-builder';
import { CaviaFactory } from './cavia-factory';

@Application()
class MyApp {
}

describe('CaviaFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should use CaviaApplicationBuilder as builder', async () => {
      await CaviaFactory.create(MyApp);

      expect(CaviaApplicationBuilder).toHaveBeenNthCalledWith(1, MyApp);
      expect(CaviaApplicationBuilder.prototype.compile).toHaveBeenCalledTimes(1);
    });

    it('should return CaviaApplication instance', async () => {
      expect(await CaviaFactory.create(MyApp)).toBeInstanceOf(CaviaApplication);
    });
  });
});
