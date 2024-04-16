/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-06 10:08:45
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 13:16:20
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

export const Schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          productionName: renderFormItemSchema({
            title: '核算产品',
            type: 'number',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
          }),
          checkContent: {
            type: 'void',
            title: '核算数量',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
            ],
            properties: {
              checkCount: renderFormItemSchema({
                validateTitle: '核算数量',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '请输入',
                },
              }),
              checkUnit: renderFormItemSchema({
                validateTitle: '核算单位',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: '请选择单位',
                },
              }),
            },
          },
          functionalUnit: renderFormItemSchema({
            title: '功能单位',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          '[beginDate, endTime]': renderFormItemSchema({
            title: '核算周期',
            'x-component': 'DatePicker.RangePicker',
            'x-component-props': {
              placeholder: ['开始日期', '结束日期'],
              placement: 'bottomLeft',
              getPopupContainer: (el: HTMLElement) => {
                return el;
              },
            },
          }),
          type: renderFormItemSchema({
            title: '系统边界',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Radio.Group',
          }),
        },
      },
    },
  );
