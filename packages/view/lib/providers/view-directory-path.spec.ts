import path from 'path';
import { VIEW_DIRECTORY_PATH, ViewDirectoryPath, viewDirectoryPathProvider } from '../../index';

describe('ViewDirectoryPath', () => {
  it('should have the appropriate token', () => {
    expect(viewDirectoryPathProvider.provide).toEqual(VIEW_DIRECTORY_PATH);
  });

  it('should have the correct path by default', () => {
    expect(viewDirectoryPathProvider.useValue).toEqual(path.join(process.cwd(), 'resources', 'views'));
  });
});
