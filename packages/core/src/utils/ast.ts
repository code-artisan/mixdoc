import { parse, ParserOptions } from '@babel/parser';

export const getAbstractTree = (code: string) => {
  const options: ParserOptions = {
    plugins: ['typescript'],
    sourceType: 'module',
  };

  return parse(code, options);
};
