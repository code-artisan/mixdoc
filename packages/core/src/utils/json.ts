export const jsonToMarkdownTable = (options) => {
  const { alias = {}, rows } = options;

  const markdown = [];
  const keys = Object.keys(alias);

  const header = [[], []];
  keys.forEach((key) => {
    header[0].push(alias[key]);
    header[1].push('--------');
  });

  rows.forEach((row, index) => {
    markdown[index] = keys.map((key) => {
      const value = (row[key] || '').length === 0 ? '--' : row[key];

      return typeof value === 'string' ? value.replace(/\|/g, '\\|') : '';
    });
  });

  return [...header, ...markdown].map((item) => `| ${item.join(' | ')} |`).join('\n');
};
