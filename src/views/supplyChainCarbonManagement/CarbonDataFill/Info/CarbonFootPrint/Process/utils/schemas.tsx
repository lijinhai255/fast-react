/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 15:31:36
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-05 10:37:36
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

export const schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          productName: renderFormItemSchema({
            title: '产品名称',
            'x-component': 'Input',
          }),
          productUnit: renderFormItemSchema({
            title: '核算单位',
            'x-component': 'Input',
          }),
          productModel: renderFormItemSchema({
            title: '规格/型号',
            'x-component': 'Input',
          }),
        },
      },
    },
  );
