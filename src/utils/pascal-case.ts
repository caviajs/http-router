import { noCase } from 'no-case';

export function pascalCase(str: string): string {
  return noCase(str)
    .split(' ')
    .map((it: string) => it.charAt(0).toUpperCase() + it.slice(1).toLowerCase())
    .join('');
}
