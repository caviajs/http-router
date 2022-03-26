import { ValidatorPackage } from './validator-package';
import { Validator } from './providers/validator';

describe('ValidatorPackage', () => {
  it('should contain built-in providers', () => {
    const validatorPackage = ValidatorPackage
      .configure()
      .register();

    expect(validatorPackage.providers.length).toBe(1);
    expect(validatorPackage.providers).toEqual([Validator]);
  });
});
