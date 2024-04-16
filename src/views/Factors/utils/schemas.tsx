/*
 * @@description:
 */
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

import { publishYear } from './index';

export const searchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    likeName: xRenderSeachSchema({
      type: 'string',
      placeholder: '因子名称',
      widget: 'input',
    }),
    year: xRenderSeachSchema({
      type: 'number',
      placeholder: '发布年份',
      enum: publishYear(),
      widget: 'select',
      props: {
        allowClear: true,
      },
    }),
    likeInstitution: xRenderSeachSchema({
      type: 'string',
      placeholder: '发布机构',
      widget: 'input',
    }),
    likeDescription: xRenderSeachSchema({
      type: 'string',
      placeholder: '适用场景',
      widget: 'input',
    }),
  },
});
