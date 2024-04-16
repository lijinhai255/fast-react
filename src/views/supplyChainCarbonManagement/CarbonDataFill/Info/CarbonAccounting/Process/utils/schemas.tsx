/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 15:31:36
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-07 17:03:26
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
          orgName: renderFormItemSchema({
            title: '碳核算企业',
            'x-component': 'Input',
          }),
          year: renderFormItemSchema({
            title: '核算年份',
            'x-component': 'Input',
          }),
        },
      },
    },
  );
