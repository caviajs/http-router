import { Token, ValueProvider } from '@caviajs/core';
import path from 'path';

export const VIEW_DIRECTORY_PATH: Token<ViewDirectoryPath> = Symbol('VIEW_DIRECTORY_PATH');

export const viewDirectoryPathProvider: ValueProvider<ViewDirectoryPath> = {
  provide: VIEW_DIRECTORY_PATH,
  useValue: path.join(process.cwd(), 'resources', 'views'),
};

export type ViewDirectoryPath = string;