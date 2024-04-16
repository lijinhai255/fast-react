/*
 * @@description: 碳足迹核算-核算模型-排放源-选择排放因子schema文件
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 22:27:22
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-14 16:48:10
 */

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

/** 选择供应商数据-搜索schema */
export const searchSchema = () => ({
  type: 'object',
  properties: {
    likeProductName: xRenderSeachSchema({
      type: 'string',
      placeholder: '供应商名称',
      widget: 'input',
    }),
    likeSupplierName: xRenderSeachSchema({
      type: 'string',
      placeholder: '产品名称',
      widget: 'input',
    }),
  },
});
