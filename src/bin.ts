#!/usr/bin/env node
import 'reflect-metadata';

import yargs from 'yargs';
import { join, sep } from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { pascalCase } from './main/utils/pascal-case';
import { kebabCase } from './main/utils/kebab-case';
import { ApiSpec } from './main/providers/http-server-router';
import { camelCase } from './main/utils/camel-case';
import { snakeCase } from './main/utils/snake-case';
import { composeHttpClientTemplate } from './bin/compose-http-client-template';
import { HttpClient, HttpResponse } from './main/providers/http-client';
import { composeEndpointTemplate } from './bin/compose-endpoint-template';
import { composeExceptionTemplate } from './bin/compose-exception-template';
import { composeWorkerTemplate } from './bin/compose-worker-template';
import { composeProviderTemplate } from './bin/compose-provider-template';
import { composeParserTemplate } from './bin/compose-parser-template';
import { composeInterceptorTemplate } from './bin/compose-interceptor-template';

async function generate(options: { template: string, path: string }): Promise<void> {
  const paths: string[] = options.path.replace(/(\/|\\)/g, sep).split(sep);
  const componentDir: string = join(process.cwd(), ...paths.slice(0, -1));
  const componentNameAsKebabCase: string = kebabCase(paths[paths.length - 1]);
  const componentNameAsPascalCase: string = pascalCase(paths[paths.length - 1]);

  const dist: string = join(componentDir, `${ componentNameAsKebabCase }-${ options.template }.ts`);

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir);
  }

  let content: string = '';

  switch (options.template) {
    case 'endpoint':
      content = composeEndpointTemplate(`${ componentNameAsPascalCase }Endpoint`);
      break;
    case 'exception':
      content = composeExceptionTemplate(`${ componentNameAsPascalCase }Exception`);
      break;
    case 'interceptor':
      content = composeInterceptorTemplate(`${ componentNameAsPascalCase }Interceptor`);
      break;
    case 'parser':
      content = composeParserTemplate(`${ componentNameAsPascalCase }Parser`);
      break;
    case 'provider':
      content = composeProviderTemplate(`${ componentNameAsPascalCase }Provider`);
      break;
    case 'worker':
      content = composeWorkerTemplate(`${ componentNameAsPascalCase }Worker`);
      break;
  }

  fs.writeFileSync(dist, content);

  process.stdout.write(`File '${ chalk.blueBright(dist) }' has been generated\n`);
}

yargs
  .command({
    aliases: ['ghc'],
    command: 'generate-http-client <path>',
    describe: 'generate http client',
    builder: args => {
      return args
        .positional('path', { demandOption: false, type: 'string' })
        .positional('spec', { demandOption: false, type: 'string' });
    },
    handler: async args => {
      const httpClient: HttpClient = new HttpClient();

      const apiSpecResponse: HttpResponse<ApiSpec> = await httpClient.request({
        method: 'GET',
        responseType: 'json',
        url: args.spec as string,
      });

      if (apiSpecResponse.statusCode >= 400) {
        throw new Error(apiSpecResponse.statusMessage);
      }

      const paths: string[] = (args.path as string).replace(/(\/|\\)/g, sep).split(sep);
      const distDir: string = join(process.cwd(), ...paths.slice(0, -1));

      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
      }

      const dist: string = join(distDir, `${ kebabCase(paths[paths.length - 1]) }-http-client.ts`);

      fs.writeFileSync(dist, await composeHttpClientTemplate(`${ pascalCase(paths[paths.length - 1]) }HttpClient`, apiSpecResponse.body));

      process.stdout.write(`File '${ chalk.blueBright(dist) }' has been generated\n`);
    },
  })
  .command({
    aliases: ['m:en'],
    command: 'make:endpoint <path>',
    describe: 'generate endpoint',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'endpoint', path: args.path as string }),
  })
  .command({
    aliases: ['m:ex'],
    command: 'make:exception <path>',
    describe: 'generate exception',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'exception', path: args.path as string }),
  })
  .command({
    aliases: ['m:i'],
    command: 'make:interceptor <path>',
    describe: 'generate interceptor',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'interceptor', path: args.path as string }),
  })
  .command({
    aliases: ['m:pa'],
    command: 'make:parser <path>',
    describe: 'generate parser',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'parser', path: args.path as string }),
  })
  .command({
    aliases: ['m:pr'],
    command: 'make:provider <path>',
    describe: 'generate provider',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'provider', path: args.path as string }),
  })
  .command({
    aliases: ['m:w'],
    command: 'make:worker <path>',
    describe: 'generate worker',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'worker', path: args.path as string }),
  })
  .parse();
