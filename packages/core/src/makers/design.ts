import path from 'path';
import axios, { AxiosResponse } from 'axios';
import { get, forEach, last } from 'lodash';
import { download } from '../utils';

const format = (string) => {
  return (
    string
      .replace(/<a name="[0-9a-zA-Z]+"><\/a>/g, '')
      .replace(/(\*\*|__)(.*?)(\*\*|__)/g, ($1) => `${$1} `)
      .replace(/!\[.*\]\(.*\)/g, ($1) => `\n${$1}\n\n`)
  );
};

const getAllImageFromString = (string) => {
  let matcher = null;

  const images = [];
  while ((matcher = pattern.exec(string)) !== null) {
    images.push(get(matcher, 2));
  }

  return images;
}

const pattern = /!\[(.*?)\]\((.*?)\)/mg;

export default {
  make: ({ slug, name }, options) => {
    if (typeof options.token !== 'string') {
      throw new Error('🐞 [mixdoc error]: token 不能为空，请填写 token。');
    }

    if (typeof options.namespace !== 'string') {
      throw new Error('🐞 [mixdoc error]: namespace 不能为空，请填写 namespace。');
    }

    if (typeof slug === 'string') {
      axios.defaults.headers.common['X-Auth-Token'] = options.token;

      const url = `https://www.yuque.com/api/v2/repos/${options.namespace}/docs/${slug}`;

      return (
        axios.get(url).then(({ data: { data: response } }: AxiosResponse) => {
          let document = options.onFetchDesignDraft?.(response?.body) || format(response?.body);

          const tasks = [];
          if (options.shouldReplaceRemoteImageSourceToLocale) {
            const output = path.resolve(options.directory, name, options.output?.image);
            forEach(getAllImageFromString(document), (image) => {
              const filename = last(image.split('/'));

              tasks.push(download(image, output, filename).then((localpath) => {
                options.onImageDownloaded?.(image, filename);

                document = document.replace(image, `./${options.output?.image}/${localpath}`);
              }));
            })
          }

          return new Promise((resolve) => Promise.all(tasks).finally(() => resolve(document)));
        })
      );
    }

    return new Promise((resolve) => resolve(''));
  },
};
