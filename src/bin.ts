#!/usr/bin/env node
import yargs from 'yargs';

import { Edge } from 'edge.js';
import { join, sep } from 'path';
import fs from 'fs';
import clc from 'cli-color';

yargs
  .command({
    command: 'generate <template> <name>',
    describe: 'generate cavia component',
    builder: args => {
      return args
        .positional('template', {
          choices: ['controller', 'interceptor', 'service'],
          demandOption: false,
          type: 'string',
        })
        .positional('name', {
          demandOption: false,
          type: 'string',
        })
        .option('path', {
          demandOption: true,
          type: 'string',
          default: '',
        });
    },
    handler: async argv => {
      const edge: Edge = new Edge().mount(join(__dirname, 'bin', 'templates'));

      const template: string = argv.template as string;
      const name: string = (argv.name as string).toLowerCase();
      const path: string[] = argv.path ? (argv.path as string).split(sep) : [];

      const dist = join(process.cwd(), ...path, `${ name }.${ template }.ts`);
      const data = await edge.render(template, {
        name: name[0].toUpperCase() + name.slice(1),
      });

      fs.writeFileSync(dist, data);

      process.stdout.write(`File '${ clc.magentaBright(dist) } has been generated'\n`);
    },
  })
  .parse();
