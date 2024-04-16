/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-22 10:55:03
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-22 11:02:44
 */

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = () => ({
  type: 'object',
  properties: {
    likeProductName: xRenderSeachSchema({
      type: 'string',
      placeholder: '产品名称',
      widget: 'input',
    }),
  },
});
