import { noCase } from 'no-case';

export function snakeCase(str: string): string {
  return noCase(str)
    .split(' ')
    .join('_');
}
