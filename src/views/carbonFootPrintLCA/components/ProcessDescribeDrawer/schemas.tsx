import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

import { OUTPUT_ALLOCATION_OPTIONS, DATA_TYPE_OPTIONS } from './constant';
import style from './index.module.less';

/** 过程描述schemas */
export const schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          processName: renderFormItemSchema({
            title: '过程名称',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          systemBoundary: renderFormItemSchema({
            title: '系统边界',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          timeRepresent: renderFormItemSchema({
            title: '时间代表性',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
          area: {
            type: 'void',
            title: '地理代表性',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-component-props': {
              className: style.gridWrapper,
            },
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
              areaRepresent: renderFormItemSchema({
                validateTitle: '地理代表性',
                type: 'number',
                'x-component': 'Select',
                'x-component-props': {
                  showSearch: true,
                  optionFilterProp: 'label',
                  allowClear: true,
                },
              }),
              areaRepresentDetail: renderFormItemSchema({
                validateTitle: '详情地址',
                required: false,
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
            },
          },
          techRepresent: renderFormItemSchema({
            title: '技术代表性',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          multiOutput: renderFormItemSchema({
            title: '多输出分配',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
            enum: OUTPUT_ALLOCATION_OPTIONS,
          }),
          processDataType: renderFormItemSchema({
            title: '数据类型',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
            enum: DATA_TYPE_OPTIONS,
          }),
          dataSource: renderFormItemSchema({
            title: '数据来源',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          processDesc: renderFormItemSchema({
            title: '过程描述',
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
