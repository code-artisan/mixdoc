import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { first, isFunction, isString } from 'lodash';
import jetpack from 'fs-jetpack';
import logger from './logger';

export * from './ast';

export * from './json';

export { default as logger } from './logger';

export const download = async (url: string, directory: string, name: string) => {
  const filename = first(name.split('#'));
  const filepath = path.resolve(directory, filename);

  if (fs.existsSync(directory) === false) {
    fs.mkdirSync(directory);
  }

  const writer = fs.createWriteStream(filepath);
  const { data: response } :any = await axios.get(url, { responseType: 'stream' });

  response.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('error', reject);
    writer.on('finish', (...args) => resolve(filename, ...args));
  });
}

export const getOriginTemplate = (name: string, options) => {
  let template;

  const { originDocumentReader } = options;
  if (isFunction(originDocumentReader)) {
    const result = originDocumentReader(name);

    try {
      // Promise 的情况
      if (result instanceof Promise) {
        result.then((response) => {
          template = response.toString();
        });
      // Buffer or String.
      } else {
        template = result.toString();
      }
    } catch (error) {
      logger.error(`🐞 [mixdoc error]: ${error.stack}`);
    }
  } else {
    const filepath = path.resolve(options.directory, name, '.template.md');

    try {
      // 读取本地文件
      template = jetpack.read(filepath, 'utf8');
    } catch (error) {
      logger.error(`🐞 [mixdoc error]: ${error.stack}`);
    }
  }

  if (!isString(template)) {
    logger.warn(`🐞 [mixdoc warning]: can not find component template file: ${name}`);
  }

  return isString(template) ? template : '';
}
