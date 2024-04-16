/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-30 18:04:42
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

export const infoSchema = (isAdd: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          productName: renderFormItemSchema({
            title: '产品名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          orgId: renderFormItemSchema({
            title: '所属组织',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
            'x-disabled': !isAdd,
          }),
          productUnit: renderFormItemSchema({
            title: '核算单位',
            'x-component': 'Cascader',
            'x-component-props': {
              placeholder: '请选择单位',
            },
          }),
          productModel: renderFormItemSchema({
            title: '规格/型号',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          empty: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          productDesc: renderFormItemSchema({
            title: '产品描述',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 1000,
              style: {
                height: 100,
                alignItems: 'flex-start',
              },
            },
          }),
        },
      },
    },
  );
