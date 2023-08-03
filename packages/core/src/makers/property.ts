import path from 'path';
import jetpack from 'fs-jetpack';
import generator from '@babel/generator';
import traverse from '@babel/traverse';
import { get, isFunction, isString, isPlainObject } from 'lodash';
import { getAbstractTree, jsonToMarkdownTable } from '../utils';

const getRawTables = (content: string, component: string) => {
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
          version: '',
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
                } else if (value.startsWith('@version')) {
                  json.version = value.replace(/^@version[\s]*/, '');
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

const toTable = (rows: any[]) => {
  const alias = {
    name: '参数',
    defaults: '默认值',
    type: '类型',
    required: '是否必填',
    version: '版本',
    platform: '适配平台'
  };

  return `<div class="mixdoc-property-table">\n\n${jsonToMarkdownTable({ alias, rows })}\n\n</div>`;
};

const toList = (attrs: any[]) => {
  const rows = attrs.map((attr) => {
    return `### ${attr.name} \n${attr.description}\n\n默认值：${attr.defaults || '--'}\n\n|required|type|platform|\n|----|----|----|\n|${attr.required}|${attr.type}|${attr.platform}|\n`;
  });

  return `<div class="mixdoc-property-list">\n\n${rows.join('\n')}\n\n</div>`;
};

export default {
  /**
  * 解析出组件的 API 表格。
  * @param {string} component 组件名称
  * @param {object} options
  * @returns
  */
  make: (component: string, options) => {
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

      if (isPlainObject(response)) {
        result = { ...response };
      }

      const formatter = get(options.output, 'layout.property') === 'table' ? toTable : toList;

      const iterator = (key) => {
        const rows = result[key];

        if (rows.length === 0) {
          return '';
        }

        return key === 'default' ? formatter(rows) : `### ${key}\n\n${formatter(rows)}`;
      };
      return Object.keys(result).map(iterator).join('\n\n\n') || '';
    }

    return '';
  },
};
