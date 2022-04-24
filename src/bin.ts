#!/usr/bin/env node
import yargs from 'yargs';
import { Edge } from 'edge.js';
import { join, sep } from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { noCase } from 'no-case';

const edge: Edge = new Edge().mount(join(__dirname, 'bin', 'templates'));

async function generate(options: { template: string, path: string }): Promise<void> {
  const paths: string[] = options.path.replace(/(\/|\\)/g, sep).split(sep);
  const componentDir: string = join(process.cwd(), ...paths.slice(0, -1));
  const componentNameAsKebabCase: string = noCase(paths[paths.length - 1])
    .split(' ')
    .join('-');
  const componentNameAsPascalCase: string = noCase(paths[paths.length - 1])
    .split(' ')
    .map((it: string) => it.charAt(0).toUpperCase() + it.slice(1).toLowerCase())
    .join('');

  const dist: string = join(componentDir, `${ componentNameAsKebabCase }.${ options.template }.ts`);

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir);
  }

  fs.writeFileSync(dist, await edge.render(options.template, {
    name: componentNameAsPascalCase,
  }));

  process.stdout.write(`File '${ chalk.blueBright(dist) }' has been generated\n`);
}

yargs
  .command({
    command: 'make:endpoint <path>',
    describe: 'Generate endpoint component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'endpoint', path: args.path as string }),
  })
  .command({
    command: 'make:exception <path>',
    describe: 'Generate exception component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'exception', path: args.path as string }),
  })
  .command({
    command: 'make:interceptor <path>',
    describe: 'Generate interceptor component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'interceptor', path: args.path as string }),
  })
  .command({
    command: 'make:provider <path>',
    describe: 'Generate provider component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'provider', path: args.path as string }),
  })
  .command({
    command: 'make:worker <path>',
    describe: 'Generate worker component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => generate({ template: 'worker', path: args.path as string }),
  })
  .parse();
