/*
 * @@description:表单配置项
 */

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { RegCarbonAccountValue } from '@/views/carbonAccount/util';

export const schema = (status?: 'IN' | 'OUT') =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          goodsName: renderFormItemSchema({
            title: '商品名称',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              disabled: true,
            },
            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
          amount: renderFormItemSchema({
            title: '剩余库存',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              disabled: true,
            },
            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
          changeCount: renderFormItemSchema({
            title: status === 'IN' ? '入库数量' : '出库数量',
            type: 'number',
            'x-component': 'NumberPicker',
            'x-component-props': {
              precision: 0,
            },
            'x-validator': (value: string) => RegCarbonAccountValue(value),
            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
        },
      },
    },
  );
