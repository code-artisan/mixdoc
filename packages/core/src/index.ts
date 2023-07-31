#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import { program } from 'commander';
import { merge, isFunction } from 'lodash';
import jetpack from 'fs-jetpack';
import { version } from '../package.json';
import mixdoc from './mixdoc';
import defaultMixdocConfig from '../.mixdoc';

const getCustomConfig = (filename: string) => {
  let config: any = {};

  if (typeof filename === 'string') {
    try {
      const filepath: string = path.resolve(process.cwd(), filename);

      if (jetpack.exists(filepath) === 'file') {
        const result = require(filepath);

        config = isFunction(result) ? result() : result;
      }
    } catch (error) {
      throw new Error(`🐞 [mixdoc error]: ${error?.stack}`);
    }
  }

  return config;
}

program
  .version(version)
  .command('build')
  .description('The general component library document tool.')
  .option('--config', 'config file path', '.mixdoc.js')
  .action((options) => {
    mixdoc(merge(defaultMixdocConfig(), getCustomConfig(options.config)));
  });

program.parse(process.argv);
