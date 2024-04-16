/*
 * @@description: 供应商列表搜索框
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
