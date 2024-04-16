/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-23 16:05:52
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-07 18:43:24
 */

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = () => ({
  type: 'object',
  properties: {
    likeProductionName: xRenderSeachSchema({
      type: 'string',
      placeholder: '产品名称',
      widget: 'input',
    }),
    likeProductionCode: xRenderSeachSchema({
      type: 'string',
      placeholder: '产品编码',
      widget: 'input',
    }),
  },
});
