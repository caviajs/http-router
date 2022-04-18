#!/usr/bin/env node
import yargs from 'yargs';

import { Edge } from 'edge.js';
import path from 'path';
import fs from 'fs';

yargs.command('generate', 'generate cavia component', args => args, async argv => {
  console.log('start:file generated');
  const name = 'siema';

  const edge = new Edge();
  edge.mount(path.join(__dirname, 'bin', 'templates'));
  const data = await edge.render('controller', { name: name });

  fs.writeFileSync(path.join(process.cwd(), 'src', 'controllers', `${ name }.controller.ts`), data);
  console.log('end:file generated');
});

yargs.parse();
