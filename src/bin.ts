#!/usr/bin/env node
import yargs from 'yargs';

import { Edge } from 'edge.js';
import { join, sep } from 'path';
import fs from 'fs';
import chalk from 'chalk';

async function generate(options: { template: string, path: string }): Promise<void> {
  const edge: Edge = new Edge().mount(join(__dirname, 'bin', 'templates'));

  const paths: string[] = options.path.split(sep);
  const componentDir: string = join(process.cwd(), ...paths.slice(0, -1));
  const componentName: string = paths[paths.length - 1].toLowerCase();

  const data = await edge.render(options.template, {
    name: componentName,
  });

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir);
  }

  const dist: string = join(componentDir, `${ componentName }.${ options.template }.ts`);

  fs.writeFileSync(dist, data);

  process.stdout.write(`File '${ chalk.magentaBright(dist) }' has been generated\n`);
}

yargs
  .command({
    command: 'make:controller <path>',
    describe: 'Generate controller component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => {
      generate({ template: 'controller', path: args.path as string });
    },
  })
  .command({
    command: 'make:interceptor <path>',
    describe: 'Generate interceptor component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => {
      generate({ template: 'interceptor', path: args.path as string });
    },
  })
  .command({
    command: 'make:service <path>',
    describe: 'Generate service component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => {
      generate({ template: 'service', path: args.path as string });
    },
  })
  .command({
    command: 'make:worker <path>',
    describe: 'Generate worker component',
    builder: args => args.positional('path', { demandOption: false, type: 'string' }),
    handler: args => {
      generate({ template: 'worker', path: args.path as string });
    },
  })
  .parse();
