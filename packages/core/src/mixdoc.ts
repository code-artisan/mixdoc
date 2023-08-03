import path from 'path';
import { map, isString } from 'lodash';
import ThemeMaker from './makers/theme';
import DesignMaker from './makers/design';
import PropertyMaker from './makers/property';
import { getOriginTemplate, logger } from './utils';
import jetpack from 'fs-jetpack';

type Component = {
  name: string;
  slug?: string;
};

type MixdocOption = {
  directory?: string;
  beforeStart?: () => Promise<any> | any;
  makers?: {
    theme?: (name: string, options: MixdocOption) => string;
    design?: (component: Component, options: MixdocOption) => Promise<string>;
    property?: (name: string, options: MixdocOption) => string;
  };
  components: Component[];
  useDesignMaker?: boolean;
  theme?: {
    filepath?: string;
  };
  output?: {
    path?: string;
    filename?: string;
  };
  onSuccess?: (responses: any) => void;
  onError?: (responses: any) => void;
  onComplete?: () => void;
};

export default (options: MixdocOption) => {
  const result = options.beforeStart?.();
  const preceding = result instanceof Promise ? result : Promise.resolve();

  const makers = {
    theme: options.makers?.theme || ThemeMaker.make,
    design: options.makers?.design || DesignMaker.make,
    property: options.makers?.property || PropertyMaker.make,
  };

  const components = options.components || [];

  const tasks = map(components, (item: string | Component) => {
    const name = typeof item === 'string' ? item : item.name;
    const slug = typeof item === 'string' ? null : item.slug;

    let docs = getOriginTemplate(name, options);

    let task = new Promise((resolve) => resolve(''));
    if (options.useDesignMaker && isString(slug)) {
      task = makers.design({ name, slug }, options);
    }

    return task.then((response) => {
      docs = docs.replace('<!-- design-doc -->', response);
      docs = docs.replace('<!-- api-doc -->', makers.property(name, options));

      if (isString(options.theme?.filepath)) {
        docs = docs.replace('<!-- theme-doc -->', makers.theme(name, options));
      }

      const output = options.output?.filename || 'index.zh.md';
      jetpack.write(path.resolve(options.directory, name, output), docs);
    });
  });

  logger.info('🐞 开始构建。');

  preceding.then(() => {
    return Promise.all(tasks);
  }).then((responses) => {
    options.onSuccess?.(responses);
    logger.info('🎉 构建完成。');
  }).catch((error) => {
    options.onError?.(error);
    throw new Error(`🐞 [mixdoc error]: ${error?.stack}。`);
  }).finally(() => {
    options.onComplete?.();
  });
};
