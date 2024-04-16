import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeProcessName: xRenderSeachSchema({
        type: 'string',
        placeholder: '过程名称',
      }),
      outputProductName: xRenderSeachSchema({
        type: 'string',
        placeholder: '产出产品',
      }),
    },
  };
};
