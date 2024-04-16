/*
 * @@description:
 * @Author: lichunxiao lichunxiao@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-07-08 12:04:22
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
          cancelMsg: renderFormItemSchema({
            title: '',
            'x-component': 'Input.TextArea',
            'x-decorator-props': {
              gridSpan: 3,
            },
            required: false,
            'x-component-props': {
              placeholder: '撤销原因',
              maxLength: 200,
            },
          }),
        },
      },
    },
  );
