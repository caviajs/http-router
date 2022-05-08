export function composeInterceptorTemplate(name: string): string {
  let content: string = '';

  content += `import { Injectable, Interceptor, Request, Response, Next } from '@caviajs/core';\n`;
  content += `import { Observable } from 'rxjs';\n`;
  content += `\n`;
  content += `@Injectable()\n`;
  content += `export class ${ name } extends Interceptor {\n`;
  content += `\tpublic async intercept(request: Request, response: Response, next: Next): Promise<Observable<any>> {\n`;
  content += `\t\treturn next.handle();\n`;
  content += `\t}\n`;
  content += `}\n`;
  content += `\n`;

  return content;
}
