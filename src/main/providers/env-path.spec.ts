import path from 'path';
import { ENV_PATH, EnvPathProvider } from './env-path';

describe('EnvPathProvider', () => {
  it('should have the appropriate token', () => {
    expect(EnvPathProvider.provide).toEqual(ENV_PATH);
  });

  it('should have the correct path by default', () => {
    expect(EnvPathProvider.useValue).toEqual(path.join(process.cwd(), '.env'));
  });
});
