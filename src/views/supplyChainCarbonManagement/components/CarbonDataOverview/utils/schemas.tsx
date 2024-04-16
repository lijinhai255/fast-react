/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-05 14:39:34
 */

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          supplierName: renderFormItemSchema({
            title: '供应商名称',
            required: false,
            'x-component': 'Input',
          }),
          orgName: renderFormItemSchema({
            title: '所属组织',
            'x-component': 'Input',
          }),
          dataType_name: renderFormItemSchema({
            title: '数据类型',
            'x-component': 'Input',
          }),
          gasData: renderFormItemSchema({
            title: '温室气体排放数据',
            'x-component': 'Input',
          }),
          submitTime: renderFormItemSchema({
            title: '提交时间',
            'x-component': 'Input',
          }),
          applyStatus_name: renderFormItemSchema({
            title: '状态',
            'x-component': 'Input',
          }),
        },
      },
    },
  );
