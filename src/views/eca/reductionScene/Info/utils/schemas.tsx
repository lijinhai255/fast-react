/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 18:19:23
 */
import { ISchema } from '@formily/react';
import { TreeProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { renderFormItemSchema } from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  InputTextLength50,
  RegNumber,
  RegUnitNumber,
  TextAreaMaxLength1000,
} from '@/views/eca/util/type';
import { initFormilyShema } from '@/views/eca/util/util';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (pageTypeInfo?: PageTypeInfo): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              sceneName: renderFormItemSchema({
                type: 'string',
                title: '减排场景名称',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              }),
              orgId: renderFormItemSchema({
                type: 'string',
                title: '所属组织',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: pageTypeInfo !== PageTypeInfo.add,
                  placeholder: '请选择',
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              }),
              sceneType: renderFormItemSchema({
                type: 'string',
                title: '减排量量化类型',
                enum: [
                  {
                    label: '总减排量',
                    value: '1',
                  },
                  {
                    label: '单位减排量',
                    value: '2',
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'CousCheckBox',
                'x-component-props': {
                  options: [
                    {
                      label: '总减排量',
                      value: '1',
                    },
                    {
                      label: '单位减排量',
                      value: '2',
                    },
                  ],
                },
              }),
              sceneDesc: renderFormItemSchema({
                type: 'string',
                title: '减排场景描述',
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: TextAreaMaxLength1000,
                  style: {
                    height: 200,
                    alignItems: 'flex-start',
                  },
                },
              }),
            },
          },
        },
      },
    },
  };
};
export const totalSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              totalDesc: renderFormItemSchema({
                type: 'string',
                title: '总减排量描述',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              }),
              totalLessenType: renderFormItemSchema({
                type: 'string',
                title: '总减排量类型',
                enum: [
                  {
                    label: '确定',
                    value: '0',
                  },
                  {
                    label: '区间',
                    value: '1',
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'CousRadio',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: '请输入',
                  style: { width: '50%' },
                  options: [
                    {
                      label: '确定',
                      value: '0',
                    },
                    {
                      label: '区间',
                      value: '1',
                    },
                  ],
                },
              }),
              totalStartValue: renderFormItemSchema({
                type: 'string',
                title: '总减排量',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-validator': [...RegNumber],
                'x-decorator-props': { gridSpan: 1 },
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                  style: { width: '100%' },
                },
                'x-reactions': {
                  dependencies: ['totalLessenType'],
                  fulfill: {
                    state: {
                      display: `{{$deps[0]==='0'?'visible':'hidden'}}`,
                    },
                  },
                },
              }),
              totalStartValueTwo: renderFormItemSchema({
                type: 'void',
                title: '总减排量',
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                'x-decorator-props': {
                  asterisk: true,
                  feedbackLayout: 'none',
                },
                'x-component-props': {
                  rowGap: 0,
                  maxColumns: 2,
                  minColumns: 2,
                },
                'x-reactions': [
                  {
                    dependencies: ['totalLessenType'],
                    fulfill: {
                      state: {
                        display: `{{$deps[0]==='1'?'visible':'hidden'}}`,
                      },
                    },
                  },
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
                  totalStartValue: renderFormItemSchema({
                    type: 'string',
                    ...initFormilyShema(
                      '起止值',
                      'NumberPicker',
                      true,
                      {},
                      true,
                    ),
                    'x-validator': [...RegNumber],
                    'x-decorator-props': {
                      addonAfter: '-',
                    },
                    'x-component-props': {
                      min: 0,
                      placeholder: '起止值',
                    },
                  }),
                  totalEndValue: renderFormItemSchema({
                    type: 'string',
                    ...initFormilyShema(
                      '请输入',
                      'NumberPicker',
                      true,
                      {},
                      true,
                    ),
                    'x-validator': [...RegNumber],
                    'x-component-props': {
                      min: 0,
                      placeholder: '请输入',
                    },
                    'x-reactions': {
                      dependencies: ['totalStartValue'],
                      fulfill: {
                        state: {
                          selfErrors:
                            '{{$deps[0]>=$self.value? "终止值大于起始值" : ""}}',
                        },
                      },
                    },
                  }),
                },
              }),
              totalUnit: renderFormItemSchema({
                type: 'string',
                title: '总减排量单位',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-decorator-props': { gridSpan: 2 },
                'x-component-props': {
                  placeholder: '请输入',
                  style: {
                    width: '50%',
                  },
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              }),
            },
          },
        },
      },
    },
  };
};
export const unitSchema = (pageTypeInfo?: PageTypeInfo): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              unitDesc: renderFormItemSchema({
                type: 'string',
                title: '单位减排量描述',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              }),
              unitLessenType: renderFormItemSchema({
                type: 'string',
                title: '单位减排量类型',
                enum: [
                  {
                    label: '确定',
                    value: '0',
                  },
                  {
                    label: '区间',
                    value: '1',
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'CousRadio',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder: '请输入',
                  style: { width: '50%' },
                  options: [
                    {
                      label: '确定',
                      value: '0',
                    },
                    {
                      label: '区间',
                      value: '1',
                    },
                  ],
                },
              }),
              unitStartValue: renderFormItemSchema({
                type: 'string',
                title: '单位减排量',
                'x-validator': [...RegUnitNumber],
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-decorator-props': { gridSpan: 1 },
                'x-component-props': {
                  placeholder: '请输入',
                },
                'x-reactions': {
                  dependencies: ['unitLessenType'],
                  fulfill: {
                    state: {
                      display: `{{$deps[0]==='0'?'visible':'hidden'}}`,
                    },
                  },
                },
              }),
              unitStartValueTwo: renderFormItemSchema({
                type: 'void',
                title: '单位减排量',
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                'x-decorator-props': {
                  asterisk: true,
                  feedbackLayout: 'none',
                },

                'x-component-props': {
                  rowGap: 0,
                  maxColumns: 2,
                  minColumns: 2,
                },
                'x-reactions': [
                  {
                    dependencies: ['unitLessenType'],
                    fulfill: {
                      state: {
                        display: `{{$deps[0]==='1'?'visible':'hidden'}}`,
                      },
                    },
                  },
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
                  unitStartValue: renderFormItemSchema({
                    type: 'string',
                    ...initFormilyShema('', 'NumberPicker', true, {}, true),
                    'x-validator': [...RegNumber],
                    'x-decorator-props': {
                      addonAfter: '-',
                    },
                    'x-component-props': {
                      min: 0,
                      placeholder: '请输入',
                    },
                  }),
                  unitEndValue: renderFormItemSchema({
                    type: 'string',
                    ...initFormilyShema(
                      '减排量',
                      'NumberPicker',
                      true,
                      {},
                      true,
                    ),
                    'x-validator': [...RegNumber],
                    'x-component-props': {
                      min: 0,
                      placeholder: '请输入',
                    },
                    'x-reactions': {
                      dependencies: ['unitStartValue'],
                      fulfill: {
                        state: {
                          selfErrors:
                            '{{$deps[0]>=$self.value? "终止值大于起始值" : ""}}',
                        },
                      },
                    },
                  }),
                },
              }),
              unit: {
                type: 'void',
                title: '单位减排量单位',
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 2 },
                'x-component': 'FormGrid',
                'x-component-props': {
                  style: { width: '50%' },
                },
                properties: {
                  unitNumeratorUnit: renderFormItemSchema({
                    type: 'string',
                    'x-decorator-props': {
                      addonAfter: '/',
                    },
                    validateTitle: '分子单位',
                    'x-validator': [
                      { require: true, message: '请选择分子单位' },
                    ],
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: '分子单位',
                      showSearch: true,
                      filterOption: (input: string, option: any) =>
                        (option?.label ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    },
                  }),
                  unitDenominatorUnit: renderFormItemSchema({
                    validateTitle: '分母单位',
                    type: 'string',
                    'x-component':
                      pageTypeInfo === PageTypeInfo.show
                        ? 'Cascader'
                        : 'Cascader',
                    'x-validator': [
                      { require: true, message: '请选择分母单位' },
                    ],
                    'x-component-props': {
                      placeholder: '分母单位',
                      displayRender: (label: string[]) => {
                        if (!label) return '';
                        return label.slice(-1);
                      },
                      showSearch: (
                        inputValue: string,
                        path: DefaultOptionType[],
                      ) =>
                        path.some(
                          option =>
                            (option.label as string)
                              .toLowerCase()
                              .indexOf(inputValue.toLowerCase()) > -1,
                        ),
                    },
                  }),
                },
              },
            },
          },
        },
      },
    },
  };
};
