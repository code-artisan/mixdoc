import path from 'path';
import { map, isString } from 'lodash';
import ThemeMaker from './makers/theme';
import DesignMaker from './makers/design';
import PropertyMaker from './makers/property';
import { getOriginTemplate, logger } from './utils';
import jetpack from 'fs-jetpack';

export default (options) => {
  const result = options.beforeStart?.();
  const preceding = result instanceof Promise ? result : Promise.resolve();

  const makers = {
    theme: options.makers?.theme || ThemeMaker.make,
    design: options.makers?.design || DesignMaker.make,
    property: options.makers?.property || PropertyMaker.make,
  };

  const components = options.components || [];

  const tasks = map(components, ({ name, slug }) => {
    let document = getOriginTemplate(name, options);

    return makers.design({ name, slug }, options).then((response) => {
      document = document.replace('<!-- design-doc -->', response);
      document = document.replace('<!-- api-doc -->', makers.property(name, options));

      if (isString(options.theme?.filepath)) {
        document = document.replace('<!-- theme-doc -->', makers.theme(name, options));
      }

      const output = options.output?.markdown || 'index.zh.md';
      jetpack.write(path.resolve(process.cwd(), options.directory, name, output), document);
    });
  });

  logger.info('๐ ๅผๅงๆๅปบใ');

  preceding.then(() => {
    return Promise.all(tasks);
  }).then((responses) => {
    options.onSuccess?.(responses);
    logger.info('๐ ๆๅปบๅฎๆใ');
  }).catch((error) => {
    options.onError?.(error);
    throw new Error(`๐ [mixdoc error]: ${error?.stack}ใ`);
  }).finally(() => {
    options.onComplete?.();
  });
};
