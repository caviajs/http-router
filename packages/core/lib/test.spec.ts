import { LOGGER_LEVEL, LoggerLevel } from '@caviajs/logger';
import { Application } from './decorators/application';
import { CaviaApplicationBuilder } from './cavia-application-builder';
import { Test } from './test';

jest.mock('./cavia-application-builder');

@Application()
class MyApp {
}

describe('Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTestingApplication', () => {
    it('should use CaviaApplicationBuilder as builder', () => {
      Test.createTestingApplication(MyApp);

      expect(CaviaApplicationBuilder).toHaveBeenNthCalledWith(1, MyApp);
    });

    it('should override logger level provider', async () => {
      const applicationBuilderOverrideProviderUseValueSpy = jest.fn();
      const applicationBuilderOverrideProviderSpy = jest
        .spyOn(CaviaApplicationBuilder.prototype, 'overrideProvider')
        .mockImplementation(() => ({
          useValue: applicationBuilderOverrideProviderUseValueSpy,
        } as any));

      Test.createTestingApplication(MyApp);

      expect(applicationBuilderOverrideProviderSpy).toHaveBeenNthCalledWith(1, LOGGER_LEVEL);
      expect(applicationBuilderOverrideProviderUseValueSpy).toHaveBeenNthCalledWith(1, LoggerLevel.OFF);
    });

    it('should return CaviaApplicationBuilder instance', () => {
      expect(Test.createTestingApplication(MyApp)).toBeInstanceOf(CaviaApplicationBuilder);
    });
  });
});
