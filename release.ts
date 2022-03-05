#!/usr/bin/env node
import yargs from 'yargs';
import fs from 'fs';
import cp from 'child_process';
import path from 'path';

const { version, registry, unpublish } = yargs
  .version(false)
  .option('registry', {
    demandOption: true,
    type: 'string',
  })
  .option('version', {
    choices: ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'],
    demandOption: false,
    type: 'string',
  })
  .option('unpublish', {
    default: false,
    type: 'boolean',
  })
  .parseSync();

const pathToDist: string = path.join(process.cwd(), 'dist');
const pathToPackages: string = path.join(process.cwd(), 'packages');
const packages: string[] = fs.readdirSync(pathToPackages).filter(name => fs.statSync(path.join(pathToPackages, name)).isDirectory());

if (unpublish) {
  // unpublish each package from the registry
  packages.forEach(pkg => {
    const { name, version } = require(path.join(pathToPackages, pkg, 'package.json'));

    cp.spawnSync('npm', ['unpublish', `${ name }@${ version }`, '--force', '--registry', registry], {
      cwd: path.join(pathToPackages, pkg),
      stdio: 'inherit',
    });
  });
}

if (version) {
  // bump npm version in every package
  packages.forEach(pkg => {
    cp.spawnSync('npm', ['version', version, '--no-git-tag-version'], {
      cwd: path.join(pathToPackages, pkg),
      stdio: 'inherit',
    });
  });
}

// remove dist dir
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// tsc
cp.spawnSync('tsc', ['--project', 'tsconfig.build.json'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

// copy the necessary package files
packages.forEach(pkg => {
  fs.copyFileSync(path.join(process.cwd(), 'LICENSE'), `dist/${ pkg }/LICENSE`);
  fs.copyFileSync(path.join(pathToPackages, pkg, 'README.md'), `dist/${ pkg }/README.md`);
  fs.copyFileSync(path.join(pathToPackages, pkg, 'package.json'), `dist/${ pkg }/package.json`);
});

// publish
packages.forEach(pkg => {
  cp.spawnSync('npm', ['publish', '--registry', registry], {
    cwd: path.join(pathToDist, pkg),
    stdio: 'inherit',
  });
});
