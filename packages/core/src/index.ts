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
      throw new Error('🐞 [mixdoc error]: 读取配置文件 .mixdoc.js 失败。');
    }
  }

  return config;
}

program
  .version(version)
  .command('build')
  .description('通用的组件库文档工具，可以用于同步组件属性、设计文档以及主题变量。')
  .option('--config', 'config file path', '.mixdoc.js')
  .action((options) => {
    mixdoc(merge(defaultMixdocConfig(), getCustomConfig(options.config)));
  });

program.parse(process.argv);
