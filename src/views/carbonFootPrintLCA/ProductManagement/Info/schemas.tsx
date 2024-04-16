import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

/** 产品信息schemas */
export const schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          name: renderFormItemSchema({
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
              allowClear: true,
            },
          }),
          code: renderFormItemSchema({
            title: '产品编码',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
          specification: renderFormItemSchema({
            title: '规格/型号',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          description: renderFormItemSchema({
            title: '产品描述',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              maxLength: 1000,
            },
          }),
        },
      },
    },
  );
