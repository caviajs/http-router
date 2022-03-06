import path from 'path';
import { VIEW_DIRECTORY_PATH, viewDirectoryPathProvider } from '../../index';

describe('viewDirectoryPathProvider', () => {
  it('should have the appropriate token', () => {
    expect(viewDirectoryPathProvider.provide).toEqual(VIEW_DIRECTORY_PATH);
  });

  it('should have the correct path by default', () => {
    expect(viewDirectoryPathProvider.useValue).toEqual(path.join(process.cwd(), 'resources', 'views'));
  });
});
