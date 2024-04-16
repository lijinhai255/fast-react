import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      processName: xRenderSeachSchema({
        type: 'string',
        placeholder: '过程名称',
      }),
      inputName: xRenderSeachSchema({
        type: 'string',
        placeholder: '输入名称',
      }),
    },
  };
};
