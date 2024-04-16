import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

/** 基本信息 */
export const infoSchema = (isAdd: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          cellId: renderFormItemSchema({
            title: '生产单元类型',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
            },
            'x-disabled': !isAdd,
          }),
          name: renderFormItemSchema({
            title: '生产单元名称',
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
            'x-disabled': !isAdd,
          }),
          cellNo: renderFormItemSchema({
            title: '生产单元编号',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
        },
      },
    },
  );
