/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-06 10:59:08
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-09 16:31:12
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
        ...renderFromGridSchema({
          columns: 1,
        }),
        properties: {
          auditStatus: renderFormItemSchema({
            title: '审核结果',
            'x-component': 'Radio.Group',
            enum: [
              {
                label: '审核通过',
                value: '1',
              },
              {
                label: '审核不通过',
                value: '2',
              },
            ],
          }),
          auditComment: renderFormItemSchema({
            title: '备注',
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 500,
            },
            'x-reactions': {
              dependencies: ['auditStatus'],
              when: `{{$deps[0]==='2'}}`,
              fulfill: {
                schema: {
                  'x-validator': [{ required: true, message: '请输入备注' }],
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
        },
      },
    },
  );
