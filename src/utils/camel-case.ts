import { noCase } from 'no-case';

export function camelCase(str: string): string {
  return noCase(str)
    .split(' ')
    .map((it: string, index: number) => {
      if (index === 0) {
        return it.toLowerCase();
      }

      return it.charAt(0).toUpperCase() + it.slice(1).toLowerCase();
    })
    .join('');
}
