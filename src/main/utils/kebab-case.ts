import { noCase } from 'no-case';

export function kebabCase(str: string): string {
  return noCase(str)
    .split(' ')
    .join('-');
}
