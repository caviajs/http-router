export function composeProviderTemplate(name: string): string {
  let content: string = '';

  content += `import { Injectable } from '@caviajs/core';\n`;
  content += `\n`;
  content += `@Injectable()\n`;
  content += `export class ${ name } {\n`;
  content += `}\n`;
  content += `\n`;

  return content;
}
