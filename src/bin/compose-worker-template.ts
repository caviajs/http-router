export function composeWorkerTemplate(name: string): string {
  let content: string = '';

  content += `import { Injectable, Worker, WorkerMetadata } from '@caviajs/core';\n`;
  content += `\n`;
  content += `@Injectable()\n`;
  content += `export class ${ name } extends Worker {\n`;
  content += `\tpublic readonly metadata: WorkerMetadata = {\n`;
  content += `\t\texpression: '* * * * *',\n`;
  content += `\t};\n`;
  content += `\n`;
  content += `\tpublic async handle(): Promise<void> {\n`;
  content += `\t\t// ...\n`;
  content += `\t}\n`;
  content += `}\n`;
  content += `\n`;

  return content;
}
