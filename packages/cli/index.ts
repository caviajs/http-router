#!/usr/bin/env node
import 'reflect-metadata';

import yargs from 'yargs';

yargs
  .version(require('./package.json').version)
  .scriptName('cavia')
  .command({
    command: [
      'oasgc',
    ],
    handler: async yargs => {
      console.log('oasgc');
    },
  })
  .parse();
