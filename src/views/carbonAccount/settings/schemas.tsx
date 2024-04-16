/*
 * @@description:
 * @Author: lichunxiao lichunxiao@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-07-12 16:41:45
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
          parentName: renderFormItemSchema({
            title: '上级分组',
            'x-component': 'Input',
            'x-component-props': {
              disabled: true,
            },
            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
          deptName: renderFormItemSchema({
            title: '分组名称',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component-props': {
              maxLength: 50,
            },
          }),
        },
      },
    },
  );
