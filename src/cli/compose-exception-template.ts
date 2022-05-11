export function composeExceptionTemplate(name: string): string {
  let content: string = '';

  content += `import { HttpException } from '@caviajs/core';\n`;
  content += `\n`;
  content += `export class ${ name } extends HttpException {\n`;
  content += `\tconstructor() {\n`;
  content += `\t\tsuper(501, '${ name }');\n`;
  content += `\t}\n`;
  content += `}\n`;
  content += `\n`;

  return content;
}
