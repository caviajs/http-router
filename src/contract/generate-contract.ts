#!/usr/bin/env node

import yargs from 'yargs';
import { join, sep } from 'path';
import fs from 'fs';
import { cyan } from 'colorette';
import { hideBin } from 'yargs/helpers';
import { pascalCase } from '../utils/pascal-case';
import { kebabCase } from '../utils/kebab-case';
import { generateHttpClient } from './generate-http-client';
import { HttpClient } from '../client/http-client';
import { Specification } from '../router/http-router';

(async (): Promise<void> => {
  const argv = yargs(hideBin(process.argv))
    .positional('output', { demandOption: true, type: 'string' })
    .positional('url', { demandOption: true, type: 'string' })
    .parseSync();

  const apiSpecResponse = await HttpClient.request({
    method: 'GET',
    responseType: 'buffer',
    url: argv.url as string,
  });

  if (apiSpecResponse.statusCode >= 400) {
    throw new Error(apiSpecResponse.statusMessage);
  }

  const apiSpec: Specification = JSON.parse(apiSpecResponse.body.toString());

  const names = new Set<string>();

  for (const route of apiSpec.routes) {
    const name: string | undefined = route.metadata?.contract?.name?.toLowerCase();

    if (typeof name === 'string') {
      if (names.has(name)) {
        throw new Error(`Duplicated '${ name }' route name`);
      }

      names.add(name);
    }
  }

  const paths: string[] = (argv.output as string).replace(/(\/|\\)/g, sep).split(sep);
  const distDir: string = join(process.cwd(), ...paths.slice(0, -1));

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  const dist: string = join(distDir, `${ kebabCase(paths[paths.length - 1]) }-contract.ts`);

  fs.writeFileSync(dist, generateHttpClient(`${ pascalCase(paths[paths.length - 1]) }Contract`, apiSpec));

  process.stdout.write(`File '${ cyan(dist) }' has been generated\n`);
})();
