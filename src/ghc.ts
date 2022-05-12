// #!/usr/bin/env node
//
// TODO
//
// import yargs from 'yargs';
// import { join, sep } from 'path';
// import fs from 'fs';
// import { cyan } from 'colorette';
// import { ApiSpec } from './lib/router';
// import { noCase } from 'no-case';
// import { hideBin } from 'yargs/helpers';
//
// function camelCase(str: string): string {
//   return noCase(str)
//     .split(' ')
//     .map((it: string, index: number) => {
//       if (index === 0) {
//         return it.toLowerCase();
//       }
//
//       return it.charAt(0).toUpperCase() + it.slice(1).toLowerCase();
//     })
//     .join('');
// }
//
// function kebabCase(str: string): string {
//   return noCase(str)
//     .split(' ')
//     .join('-');
// }
//
// function pascalCase(str: string): string {
//   return noCase(str)
//     .split(' ')
//     .map((it: string) => it.charAt(0).toUpperCase() + it.slice(1).toLowerCase())
//     .join('');
// }
//
// function composeHttpClientTemplate(name: string, apiSpec: ApiSpec): string {
//   let content: string = '';
//
//   content += `// This file was generated by Cavia, please don't edit it!\n`;
//   content += `import { HttpClient, HttpResponse } from '@caviajs/core';\n`;
//   content += `\n`;
//   content += `export class ${ name } {\n`;
//   content += `\tpublic static connectionUrl: string = '';\n`;
//
//   for (const route of apiSpec.routes) {
//     content += `\n`;
//     content += `\tpublic static async ${ camelCase(route.name) }(\n`;
//
//     if (route.schema?.request?.body) {
//       content += `\t\tbody: ${ pascalCase(route.name) }Body,\n`;
//     }
//
//     if (route.schema?.request?.headers) {
//       content += `\t\theaders: ${ pascalCase(route.name) }Headers,\n`;
//     }
//
//     if (route.schema?.request?.params) {
//       content += `\t\tparams: ${ pascalCase(route.name) }Params,\n`;
//     }
//
//     if (route.schema?.request?.query) {
//       content += `\t\tquery: ${ pascalCase(route.name) }Query,\n`;
//     }
//
//     content += `\t): Promise<${ pascalCase(route.name) }Response> {\n`;
//     content += `\t\tconst url: URL = new URL('${ route.path }', this.connectionUrl);\n`;
//     content += `\n`;
//
//     if (route.schema?.request?.params) {
//       content += `\t\tObject.entries(params || {}).forEach(([key, value]) => {\n`;
//       content += '\t\t\turl.pathname = url.pathname.replace(`:${ key }`, value);\n';
//       content += `\t\t});\n`;
//       content += `\n`;
//     }
//
//     if (route.schema?.request?.query) {
//       content += '\t\tObject.entries(query || {}).forEach(([key, value]) => {\n';
//       content += '\t\t\turl.searchParams.set(key, value);\n';
//       content += '\t\t});\n';
//       content += `\n`;
//     }
//
//     content += '\t\treturn await HttpClient.request({\n';
//
//     if (route.schema?.request?.body) {
//       content += '\t\t\tbody: body,\n';
//     }
//
//     if (route.schema?.request?.headers) {
//       content += '\t\t\theaders: headers,\n';
//     }
//
//     content += `\t\t\tmethod: '${ route.method }',\n`;
//     content += `\t\t\tresponseType: 'buffer',\n`;
//     content += `\t\t\t// timeout: undefined,\n`;
//     content += `\t\t\turl: url.toString(),\n`;
//
//     content += `\t\t}) as ${ pascalCase(route.name) }Response;\n`;
//
//     content += `\t}\n`;
//   }
//
//   content += `}\n`;
//
//   for (const route of apiSpec.routes) {
//     content += `\n`;
//
//     if (route.schema?.request?.body) {
//       content += generateTypeBySchema(`${ pascalCase(route.name) }Body`, route.schema?.request?.body);
//       content += `\n`;
//     }
//
//     if (route.schema?.request?.headers) {
//       content += generateTypeBySchema(`${ pascalCase(route.name) }Headers`, route.schema?.request?.headers);
//       content += `\n`;
//     }
//
//     if (route.schema?.request?.params) {
//       content += generateTypeBySchema(`${ pascalCase(route.name) }Params`, route.schema?.request?.params);
//       content += `\n`;
//     }
//
//     if (route.schema?.request?.query) {
//       content += generateTypeBySchema(`${ pascalCase(route.name) }Query`, route.schema?.request?.query);
//       content += `\n`;
//     }
//
//     if (route.schema?.responses) {
//       content += `export type ${ pascalCase(route.name) }Response =\n`;
//
//       Object.entries(route.schema?.responses || {}).forEach(([status, response], index, array) => {
//         content += `\t| ${ pascalCase(route.name) }Response${ status }${ index === array.length - 1 ? ';' : '' }\n`;
//       });
//
//       for (const [status, response] of Object.entries(route.schema?.responses || {})) {
//         content += `\n`;
//         content += `export interface ${ pascalCase(route.name) }Response${ status } extends HttpResponse {\n`;
//         content += `\tbody: ${ pascalCase(route.name) }Response${ status }Body,\n`;
//         content += `\theaders: ${ pascalCase(route.name) }Response${ status }Headers,\n`;
//         content += `\tstatusCode: ${ status },\n`;
//         content += `\tstatusMessage: string,\n`;
//         content += `}\n`;
//
//         content += `\n`;
//         content += generateTypeBySchema(`${ pascalCase(route.name) }Response${ status }Body`, response.body);
//
//         content += `\n`;
//         content += generateTypeBySchema(`${ pascalCase(route.name) }Response${ status }Headers`, response.headers);
//       }
//     } else {
//       content += `export type ${ pascalCase(route.name) }Response = HttpResponse;\n`;
//     }
//   }
//
//   content += `\n`;
//
//   return content;
// }
//
// function generateTypeBySchema(name: string, schema: Schema): string {
//   let content: string = '';
//
//   switch (schema?.type) {
//     case 'array':
//       content += `export type ${ pascalCase(name) } = ${ generateTypeStructureBySchema(schema) };\n`;
//       break;
//     case 'boolean':
//       content += `export type ${ pascalCase(name) } = ${ generateTypeStructureBySchema(schema) };\n`;
//       break;
//     case 'enum':
//       content += `export type ${ pascalCase(name) } = ${ generateTypeStructureBySchema(schema) };\n`;
//       break;
//     case 'number':
//       content += `export type ${ pascalCase(name) } = ${ generateTypeStructureBySchema(schema) };\n`;
//       break;
//     case 'object':
//       content += `export type ${ pascalCase(name) } = ${ generateTypeStructureBySchema(schema) };\n`;
//       break;
//     case 'string':
//       content += `export type ${ pascalCase(name) } = ${ generateTypeStructureBySchema(schema) };\n`;
//       break;
//     default:
//       content += `export type ${ pascalCase(name) } = ${ generateTypeStructureBySchema(schema) };\n`;
//       break;
//   }
//
//   return content;
// }
//
// function generateTypeStructureBySchema(schema: Schema): string {
//   const isNullable: boolean = schema ? getSchemaNullable(schema) : false;
//   const isRequired: boolean = schema ? getSchemaRequired(schema) : false;
//
//   let content: string = '';
//
//   switch (schema?.type) {
//     case 'array':
//       content += `Array<${ generateTypeStructureBySchema(schema.items) }>`;
//       break;
//     case 'boolean':
//       content += `boolean`;
//       break;
//     case 'enum':
//       Object.values(schema.enum).forEach((value, index) => {
//         if (index !== 0) {
//           content += ' ';
//         }
//
//         if (typeof value === 'string') {
//           content += `| '${ value }'`;
//         } else if (typeof value === 'number') {
//           content += `| ${ value }`;
//         } else {
//           content += `| unknown`;
//         }
//       });
//
//       break;
//     case 'number':
//       content += `number`;
//       break;
//     case 'object':
//       const isStrict: boolean = getSchemaStrict(schema);
//
//       content += '{\n';
//
//       Object.entries(schema.properties || {}).forEach(([key, value]) => {
//         content += `\t'${ key }'${ isRequired === true ? '' : '?' }: ${ generateTypeStructureBySchema(value) },\n`;
//       });
//
//       if (isStrict === false) {
//         content += `\t[name: string]: any,\n`;
//       }
//
//       content += '}';
//       break;
//     case 'string':
//       content += `string`;
//       break;
//     default:
//       content += `any`;
//       break;
//   }
//
//   if (isNullable === true) {
//     content += ' | null';
//   }
//
//   return content;
// }
//
// (async (): Promise<void> => {
//   const argv = yargs(hideBin(process.argv))
//     .positional('output', { demandOption: true, type: 'string' })
//     .positional('url', { demandOption: true, type: 'string' })
//     .parseSync();
//
//   const apiSpecResponse: HttpResponse<ApiSpec> = await HttpClient.request({
//     method: 'GET',
//     responseType: 'json',
//     url: argv.url as string,
//   });
//
//   if (apiSpecResponse.statusCode >= 400) {
//     throw new Error(apiSpecResponse.statusMessage);
//   }
//
//   const paths: string[] = (argv.output as string).replace(/(\/|\\)/g, sep).split(sep);
//   const distDir: string = join(process.cwd(), ...paths.slice(0, -1));
//
//   if (!fs.existsSync(distDir)) {
//     fs.mkdirSync(distDir);
//   }
//
//   const dist: string = join(distDir, `${ kebabCase(paths[paths.length - 1]) }-http-client.ts`);
//
//   fs.writeFileSync(dist, composeHttpClientTemplate(`${ pascalCase(paths[paths.length - 1]) }HttpClient`, apiSpecResponse.body));
//
//   process.stdout.write(`File '${ cyan(dist) }' has been generated\n`);
// })();
