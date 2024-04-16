import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

/** 碳足迹报告schemas */
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
            title: '报告名称',
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
          modelId: renderFormItemSchema({
            title: '模型名称',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
            },
          }),
          functionalUnit: renderFormItemSchema({
            title: '功能单位',
            required: false,
            'x-disabled': true,
            'x-component': 'Input',
          }),
          productName: renderFormItemSchema({
            title: '产品名称',
            required: false,
            'x-disabled': true,
            'x-component': 'Input',
          }),
          productionCycle: renderFormItemSchema({
            title: '生产周期',
            required: false,
            'x-disabled': true,
            'x-component': 'Input',
          }),
        },
      },
    },
  );
