export function composeParserTemplate(name: string): string {
  let content: string = '';

  content += `import http from 'http';\n`;
  content += `import { Injectable, Parser, ParserMetadata, HttpException } from '@caviajs/core';\n`;
  content += `\n`;
  content += `@Injectable()\n`;
  content += `export class ${ name } extends Parser {\n`;
  content += `\tpublic readonly metadata: ParserMetadata = {\n`;
  content += `\t\tmimeType: 'text/plain',\n`;
  content += `\t};\n`;
  content += `\n`;
  content += `\tpublic async parse(buffer: Buffer, headers: http.IncomingHttpHeaders): Promise<any> {\n`;
  content += `\t\tthrow new HttpException(501);\n`;
  content += `\t}\n`;
  content += `}\n`;
  content += `\n`;

  return content;
}
