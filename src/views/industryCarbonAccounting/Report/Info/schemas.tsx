import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

/** 基本信息 */
export const infoSchema = (isAdd: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          orgId: renderFormItemSchema({
            title: '组织名称',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
            },
            'x-disabled': !isAdd,
          }),
          accountYear: renderFormItemSchema({
            title: '核算年度',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
            },
          }),
          empty: renderEmptySchema({}),
          institutionName: renderFormItemSchema({
            title: '技术服务机构名称',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          institutionNumber: renderFormItemSchema({
            title: '技术服务机构统一社会信用代码',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 18,
            },
          }),
        },
      },
    },
  );
