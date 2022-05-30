/* eslint-disable @typescript-eslint/no-var-requires */
import { parse } from '@babel/parser';

export const getAbstractTree = (code) => {
  const options: any = {
    plugins: ['typescript'],
    sourceType: 'module',
  };

  return parse(code, options);
};
