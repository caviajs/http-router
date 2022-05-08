export function composeEndpointTemplate(name: string): string {
  let content: string = '';

  content += `import { Request, Response, Injectable, Endpoint, EndpointMetadata, HttpException } from '@caviajs/core';\n`;
  content += `\n`;
  content += `@Injectable()\n`;
  content += `export class ${ name } extends Endpoint {\n`;
  content += `\tpublic readonly metadata: EndpointMetadata = {\n`;
  content += `\t\tmethod: 'GET',\n`;
  content += `\t\tpath: '/',\n`;
  content += `\t};\n`;
  content += `\n`;
  content += `\tpublic async handle(request: Request, response: Response): Promise<any> {\n`;
  content += `\t\tthrow new HttpException(501);\n`;
  content += `\t}\n`;
  content += `}\n`;

  return content;
}
