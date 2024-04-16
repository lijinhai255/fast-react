/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-23 16:05:52
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-30 19:09:11
 */

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = () => ({
  type: 'object',
  properties: {
    likeSupplierName: xRenderSeachSchema({
      type: 'string',
      placeholder: '供应商名称',
      widget: 'input',
    }),
    likeSupplierCode: xRenderSeachSchema({
      type: 'string',
      placeholder: '供应商编码',
      widget: 'input',
    }),
  },
});
