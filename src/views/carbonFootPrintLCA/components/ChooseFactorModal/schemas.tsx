import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeName: xRenderSeachSchema({
        type: 'string',
        placeholder: '因子名称',
      }),
      likeProductName: xRenderSeachSchema({
        type: 'string',
        placeholder: '产品名称',
      }),
    },
  };
};
