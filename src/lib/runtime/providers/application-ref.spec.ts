import { APPLICATION_REF, createApplicationRefProvider } from './application-ref';

describe('createApplicationRefProvider', () => {
  class MyApp {
  }

  const applicationRefProvider = createApplicationRefProvider(MyApp);

  it('should have the appropriate token', () => {
    expect(applicationRefProvider.provide).toEqual(APPLICATION_REF);
  });

  it('should have the appropriate useClass value', () => {
    expect(applicationRefProvider.useClass).toEqual(MyApp);
  });
});
