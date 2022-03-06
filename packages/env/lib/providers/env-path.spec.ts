import path from 'path';
import { ENV_PATH, envPathProvider } from './env-path';

describe('envPathProvider', () => {
  it('should have the appropriate token', () => {
    expect(envPathProvider.provide).toEqual(ENV_PATH);
  });

  it('should have the correct path by default', () => {
    expect(envPathProvider.useValue).toEqual(path.join(process.cwd(), '.env'));
  });
});
