import { FactoryProvider, Token } from '@caviajs/core';
import path from 'path';

export const VIEW_DIRECTORY_PATH: Token<ViewDirectoryPath> = Symbol('VIEW_DIRECTORY_PATH');

export const viewDirectoryPathProvider: FactoryProvider<ViewDirectoryPath> = {
  provide: VIEW_DIRECTORY_PATH,
  useFactory: (): ViewDirectoryPath => {
    return path.join(process.cwd(), 'resources', 'views');
  },
};

export type ViewDirectoryPath = string;
