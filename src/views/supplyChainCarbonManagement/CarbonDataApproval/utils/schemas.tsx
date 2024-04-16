/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-26 11:06:42
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-12 23:54:52
 */

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = () => ({
  type: 'object',
  properties: {
    auditStatus: xRenderSeachSchema({
      type: 'string',
      placeholder: '状态',
      widget: 'select',
      enum: ['0', '1', '2'],
      enumNames: ['待审核', '审核通过', '审核不通过'],
      props: {
        allowClear: true,
      },
    }),
  },
});
