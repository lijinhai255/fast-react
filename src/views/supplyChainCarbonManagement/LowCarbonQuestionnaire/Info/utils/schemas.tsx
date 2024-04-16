/*
 * @@description: 问卷详情-基础信息schema
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

export const infoSchema = (isEdit: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          'x-component-props': {
            maxColumns: 2,
            minColumns: 1,
            columnGap: 16,
          },
        }),
        properties: {
          questionnaireName: renderFormItemSchema({
            title: '问卷名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          orgId: renderFormItemSchema({
            title: '所属组织',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
            'x-disabled': isEdit,
          }),
          deadline: renderFormItemSchema({
            title: '截止日期',
            'x-component': 'DatePicker',
          }),
          questionnaireDesc: renderFormItemSchema({
            title: '问卷说明',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 500,
              style: {
                height: 100,
              },
            },
          }),
        },
      },
    },
  );
