import path from 'path';
import jetpack from 'fs-jetpack';
import generator from '@babel/generator';
import traverse from '@babel/traverse';
import { get, isFunction, isString, isPlainObject } from 'lodash';
import { getAbstractTree } from '../utils';

const getRawTables = (content, component) => {
  const tables = {};

  traverse(getAbstractTree(content), {
    TSInterfaceDeclaration(paths) {
      const { name } = paths.node.id;

      let tableName = name.replace(/PropTypes|Interface$/, '').replace(new RegExp(`^${component}`), '');

      if (tableName.length === 0) {
        tableName = 'default';
      }

      tables[tableName] = [];

      paths.node.body.body.forEach(item => {
        const json = {
          name: '',
          type: '',
          platform: '',
          required: 'false',
          description: '',
          defaults: '',
          ignored: false,
        };

        if (Array.isArray(item.leadingComments)) {
          item.leadingComments.forEach(comment => {
            const items = comment.value.replace(/^\*/, '').replace(/\s+$/, '').split(/\n[\s]+\*\s/);

            items.forEach(value => {
              if (value.length > 0) {
                if (value.startsWith('@platform')) {
                  json.platform = value.replace(/^@platform[\s]*/, '');
                } else if (value.startsWith('@default')) {
                  json.defaults = value.replace(/^@default[\s]*/, '');
                } else if (value.startsWith('@ignore')) {
                  json.ignored = true;
                } else {
                  json.description += `${value.replace(/^@desc[\s]*/, '')}`;
                }
              }
            });

            json.type = `\`${generator(item.typeAnnotation.typeAnnotation).code}\``.replace(/\s+\|\s+/g, ' \\| ').replace(/\n/g, '');
            json.name = get(item.key, 'name', '');
            json.required = `${Boolean(item.optional) === false}`;
          });
        }

        if (json.ignored !== true && json.name.length > 0) {
          tables[tableName].push(json);
        }
      });
    },
  });

  return tables;
};

const format = rows => {
  return rows.map(row => `### ${row.name} \n${row.description}\n\n默认值：${row.defaults || '--'}\n\n|required|type|platform|\n|----|----|----|\n|${row.required}|${row.type}|${row.platform}|\n`).join('\n');
};

export default {
  /**
  * 解析出组件的 API 表格。
  * @param {string} directory 地址前缀
  * @param {string} component 组件名称
  * @param {object} options
  * @returns
  */
  make: (component, options) => {
    const { onFetchComponentProperty } = options;

    const filepath = path.resolve(
      options.workspace,
      component,
      options?.property?.filename || 'interface.ts'
    );

    if (jetpack.exists(filepath) === 'file') {
      let result = getRawTables(jetpack.read(filepath, 'utf8'), component);

      let response;
      if (isFunction(onFetchComponentProperty)) {
        response = onFetchComponentProperty(result);
      }

      if (isString(response)) {
        return response;
      }

      const iterator = (key) => {
        const rows = result[key];

        if (rows.length === 0) {
          return '';
        }

        return key === 'default' ? format(rows) : `### ${key}\n\n${format(rows)}`;
      };

      if (isPlainObject(response)) {
        result = { ...response };
      }

      return Object.keys(result).map(iterator).join('\n\n\n') || '';
    }

    return '';
  },
};
