#!/usr/bin/env node
import 'reflect-metadata';

import yargs from 'yargs';
import { MetaCommand } from './lib/commands/meta';

yargs
  .version(require('./package.json').version)
  .scriptName('cavia')
  .command(MetaCommand)
  .parse();
