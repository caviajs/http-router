import { Application } from './decorators/application';
import { ApplicationBuilder } from './application-builder';
import { ApplicationFactory } from './application-factory';
import { ApplicationRef } from './application-ref';

@Application()
class MyApp {
}

describe('ApplicationFactory', () => {
  describe('configureApplication', () => {
    it('should use ApplicationBuilder as builder', async () => {
      const applicationBuilderCompileSpy = jest.spyOn(ApplicationBuilder.prototype, 'compile');
      const applicationBuilderInitSpy = jest.spyOn(ApplicationBuilder, 'init');

      await ApplicationFactory.configureApplication(MyApp);

      expect(applicationBuilderCompileSpy).toHaveBeenCalledTimes(1);
      expect(applicationBuilderInitSpy).toHaveBeenNthCalledWith(1, MyApp);
    });

    it('should return ApplicationRef instance', async () => {
      expect(await ApplicationFactory.configureApplication(MyApp)).toBeInstanceOf(ApplicationRef);
    });
  });
});
