import path from 'path';
import { VIEW_DIRECTORY_PATH, ViewDirectoryPathProvider } from './view-directory-path';

describe('ViewDirectoryPathProvider', () => {
  it('should have the appropriate token', () => {
    expect(ViewDirectoryPathProvider.provide).toEqual(VIEW_DIRECTORY_PATH);
  });

  it('should have the correct path by default', () => {
    expect(ViewDirectoryPathProvider.useValue).toEqual(path.join(process.cwd(), 'resources', 'views'));
  });
});
