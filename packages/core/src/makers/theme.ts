import jetpack from 'fs-jetpack';
import path from 'path';
import generator from '@babel/generator';
import traverse from '@babel/traverse';
import { has, get, snakeCase, isFunction, isString } from 'lodash';
import { jsonToMarkdownTable, getAbstractTree } from '../utils';

const columns = {
  label: '变量名',
  value: '默认值',
  alias: '说明',
};

export default {
  make: (component, options) => {
    const snake = snakeCase(component).replace(/-/g, '_');
    const filepath = path.resolve(
      process.cwd(),
      'node_modules',
      options.libSourceCodeWorkspace,
      component,
      options?.theme?.filename || 'style/theme.ts'
    );

    const properties = [];

    if (jetpack.exists(filepath) === 'file') {
      const content = jetpack.read(filepath, 'utf8');

      if (typeof content === 'string') {
        traverse(getAbstractTree(content), {
          ExportDefaultDeclaration(paths) {
            const bindings = paths.scope.bindings;

            paths.node.declaration.properties.forEach((property) => {
              const name = property.key.name;

              if (name.replace(/^(\$|\@)/, '').startsWith(snake)) {
                const value = generator(property.value).code.replace(/'|"/g, '');

                // 判断一下是否是引用了别的变量，如果是的话则 value 为变量的值。
                const isReferenceOtherAariable = has(property.value, 'name') && has(bindings, property.value.name);

                properties.push({
                  label: name,
                  alias: get(property, 'leadingComments[0].value', '--'),
                  value: isReferenceOtherAariable ? get(bindings, 'path.node.init.value', value) : value,
                });
              }
            });
          },
        });
      }
    }

    let result = [...properties];

    const { onFetchComponentThemeVariable } = options;

    let response;
    if (isFunction(onFetchComponentThemeVariable)) {
      response = onFetchComponentThemeVariable(component, properties, options.index);
    }

    if (isString(response)) {
      return response;
    }

    if (Array.isArray(response)) {
      result = [...response];
    }

    return result.length > 0 ? jsonToMarkdownTable({ alias: columns, rows: result }) : '';
  },
};
