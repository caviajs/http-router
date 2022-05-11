#!/usr/bin/env node
import yargs from 'yargs';
import { join, sep } from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { pascalCase } from './utils/pascal-case';
import { kebabCase } from './utils/kebab-case';
import { ApiSpec } from './http-server/http-router';
import { composeHttpClientTemplate } from './cli/compose-http-client-template';
import { HttpClient, HttpResponse } from './http-client/http-client';
import { composeExceptionTemplate } from './cli/compose-exception-template';

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
    case 'exception':
      content = composeExceptionTemplate(`${ componentNameAsPascalCase }Exception`);
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
      const apiSpecResponse: HttpResponse<ApiSpec> = await HttpClient.request({
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
    aliases: ['m:ex'],
    command: 'make:exception <path>',
    describe: 'generate exception',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'exception', path: args.path as string }),
  })
  .parse();
