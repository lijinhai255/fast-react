/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-01 17:25:29
 */
import { ISchema } from '@formily/react';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import {
  renderEmptySchema,
  renderFormilyTableAction,
  renderFormItemSchema,
} from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';
import { shakingObj } from '@/utils';
// import { publishYear } from '@/views/Factors/utils';
import {
  InputTextLength50,
  RegEmail,
  RegPhone,
  TextAreaMaxLength1000,
} from '@/views/eca/util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

// 减排信息
export const schema = ({
  pageTypeInfo,
}: {
  pageTypeInfo?: PageTypeInfo;
}): ISchema => {
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
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              reductionSceneIds: {
                type: 'array',
                'x-decorator-props': { gridSpan: 24 },
                'x-decorator': 'FormItem',
                'x-component': 'ArrayTable',
                'x-component-props': {
                  pagination: false,
                  scroll: { x: 1200 },
                },
                items: {
                  properties: shakingObj({
                    columns1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '序号',
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_, index) => `${(index || 0) + 1}`,
                          },
                        ),
                      },
                    },
                    columns2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '减排场景名称',
                      },
                      properties: {
                        sceneName: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.sceneName || '-'}`,
                          },
                        ),
                      },
                    },
                    columns3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '总减排量',
                      },
                      properties: {
                        totalCarbonEmission: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row =>
                              `${row?.totalCarbonEmission || '-'}`,
                          },
                        ),
                      },
                    },
                    columns4: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '单位减排量',
                      },
                      properties: {
                        unitCarbonEmission: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.unitCarbonEmission || '-'}`,
                          },
                        ),
                      },
                    },
                    columns5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '减排场景描述',
                      },
                      properties: {
                        sceneDesc: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => `${row?.sceneDesc || '-'}`,
                          },
                        ),
                      },
                    },
                    column6:
                      pageTypeInfo === PageTypeInfo.show
                        ? undefined
                        : renderFormilyTableAction({
                            actionBtns: ({ index, array }) => [
                              {
                                label: '删除',
                                key: 'del',
                                'x-component': 'ArrayTable.Remove',
                                onClick: async () => {
                                  array?.field?.remove(index);
                                },
                              },
                            ],
                            wrapperProps: {
                              'x-component-props': {
                                width: 120,
                                fixed: 'right',
                              },
                            },
                          }),
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
// 核算信息
export const accountInformationSchema = (
  pageTypeInfo?: PageTypeInfo,
): ISchema => {
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
              minColumns: 3,
            },
            properties: {
              reportName: {
                type: 'string',
                title: '报告名称',
                'x-validator': [{ required: true, message: '请输入报告名称' }],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                  style: { maxWidth: 400 },
                },
              },
              orgId: {
                type: 'string',
                title: '所属组织',
                'x-validator': [{ required: true, message: '请选择所属组织' }],
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
              },
              year: {
                type: 'string',
                title: '核算年度',
                'x-validator': [{ required: true, message: '请输入核算年度' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  // options: publishYear().map(item => {
                  //   return {
                  //     label: item,
                  //     value: item,
                  //   };
                  // }),
                },
              },
              controlPlanId: {
                type: 'string',
                title: '数据质量控制版本',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请输入',
                },
              },
            },
          },
        },
      },
    },
  };
};
// 报告负责人信息
export const reportInformationSchema = (): ISchema => {
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
              minColumns: 3,
            },
            properties: {
              mainName: renderFormItemSchema({
                type: 'string',
                required: false,
                title: '报告负责人姓名',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                  style: { maxWidth: 400 },
                },
              }),
              mainPhone: {
                type: 'string',
                title: '报告负责人电话',
                required: false,
                'x-validator': RegPhone,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                },
              },
              mainEmail: {
                type: 'string',
                title: '报告负责人邮箱',
                required: false,
                'x-validator': [...RegEmail],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: 100,
                },
              },
            },
          },
        },
      },
    },
  };
};
// 其他情况说明
export const otherInformSchema = (): ISchema => {
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
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              absolution: renderFormItemSchema({
                type: 'string',
                title: '排放源免除说明',
                'x-decorator-props': { gridSpan: 24 },

                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                required: false,
                'x-component-props': {
                  placeholder:
                    '有产生排放，但无法量化或测量的排放源，请在这里说明',
                  maxLength: TextAreaMaxLength1000,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                },
              }),
              quantizationChangeDesc: renderFormItemSchema({
                type: 'string',
                title: '量化方法变更说明',
                'x-decorator-props': { gridSpan: 24 },

                required: false,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '若量化方法相较于基准年发生变更，请加以说明',
                  maxLength: TextAreaMaxLength1000,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                },
              }),
              biomassDesc: renderFormItemSchema({
                type: 'string',
                title: '生物质相关排放',
                'x-decorator-props': { gridSpan: 24 },

                required: false,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder:
                    '若存在源自生物质或生物质燃料燃烧的排放，请加以说明',
                  maxLength: TextAreaMaxLength1000,
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                },
              }),
              elseDesc: renderFormItemSchema({
                type: 'string',
                title: '其他情况说明',
                'x-decorator-props': { gridSpan: 24 },

                required: false,
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '描述针对报告的其他说明',
                  maxLength: TextAreaMaxLength1000,
                  style: {
                    height: 100,
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
