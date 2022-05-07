#!/usr/bin/env node
import yargs from 'yargs';
import { Edge } from 'edge.js';
import { join, sep } from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { pascalCase } from './main/utils/pascal-case';
import { kebabCase } from './main/utils/kebab-case';
import { ApiSpec } from './main/providers/http-server-router';
import { camelCase } from './main/utils/camel-case';
import { snakeCase } from './main/utils/snake-case';

const edge: Edge = new Edge().mount(join(__dirname, 'bin', 'templates'));

edge.global('camelCase', (data: string) => camelCase(data));
edge.global('kebabCase', (data: string) => kebabCase(data));
edge.global('pascalCase', (data: string) => pascalCase(data));
edge.global('snakeCase', (data: string) => snakeCase(data));

async function generate(options: { template: string, path: string }): Promise<void> {
  const paths: string[] = options.path.replace(/(\/|\\)/g, sep).split(sep);
  const componentDir: string = join(process.cwd(), ...paths.slice(0, -1));
  const componentNameAsKebabCase: string = kebabCase(paths[paths.length - 1]);
  const componentNameAsPascalCase: string = pascalCase(paths[paths.length - 1]);

  const dist: string = join(componentDir, `${ componentNameAsKebabCase }.${ options.template }.ts`);

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir);
  }

  fs.writeFileSync(dist, await edge.render(options.template, {
    name: componentNameAsPascalCase,
  }));

  process.stdout.write(`File '${ chalk.blueBright(dist) }' has been generated\n`);
}

async function generateHttpClient(options: { path: string, spec: string }): Promise<void> {
  const apiSpec: ApiSpec = {
    endpoints: [
      {
        'name': 'UpdateUserEndpoint',
        'data': {
          'permissions': 'users:update'
        },
        'method': 'PUT',
        'path': '/users/:id',
        'schema': {
          'request': {
            'body': {
              'type': 'string',
              'required': true
            },
            'headers': {
              'properties': {
                'x-test': {
                  'type': 'string',
                  'required': true
                }
              },
              'type': 'object'
            },
            'query': {
              'properties': {
                'lorem': {
                  'type': 'string',
                  'required': true
                }
              },
              'type': 'object'
            }
          }
        }
      },
    ],
  };

  const paths: string[] = options.path.replace(/(\/|\\)/g, sep).split(sep);
  const distDir: string = join(process.cwd(), ...paths.slice(0, -1));
  const componentNameAsKebabCase: string = kebabCase(paths[paths.length - 1]);
  const componentNameAsPascalCase: string = pascalCase(paths[paths.length - 1]);
  const dist: string = join(distDir, `${ componentNameAsKebabCase }.http-client.ts`);

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  fs.writeFileSync(dist, await edge.render('http-client', {
    endpoints: apiSpec.endpoints,
    name: componentNameAsPascalCase,
  }));

  process.stdout.write(`File '${ chalk.blueBright(dist) }' has been generated\n`);
}

yargs
  .command({
    command: 'generate-http-client <path>',
    describe: 'generate http client',
    builder: args => {
      return args
        .positional('path', { demandOption: false, type: 'string' })
        .positional('spec', { demandOption: false, type: 'string' });
    },
    handler: args => generateHttpClient({ path: args.path as string, spec: args.path as string }),
  })
  .command({
    command: 'make:endpoint <path>',
    describe: 'generate endpoint',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'endpoint', path: args.path as string }),
  })
  .command({
    command: 'make:exception <path>',
    describe: 'generate exception',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'exception', path: args.path as string }),
  })
  .command({
    command: 'make:interceptor <path>',
    describe: 'generate interceptor',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'interceptor', path: args.path as string }),
  })
  .command({
    command: 'make:parser <path>',
    describe: 'generate parser',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'parser', path: args.path as string }),
  })
  .command({
    command: 'make:provider <path>',
    describe: 'generate provider',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'provider', path: args.path as string }),
  })
  .command({
    command: 'make:worker <path>',
    describe: 'generate worker',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'worker', path: args.path as string }),
  })
  .parse();
