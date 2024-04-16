/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-28 20:14:36
 */
import { ISchema } from '@formily/react';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import {
  renderFormilyTableAction,
  renderEmptySchema,
  renderFormItemSchema,
} from '@/components/formily/utils';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (): ISchema => {
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
              souceList: {
                title: '',
                type: 'array',
                'x-component': 'ArrayTable',
                'x-decorator-props': {
                  gridSpan: 3,
                },
                'x-decorator': 'FormItem',
                'x-component-props': {
                  pagination: false,
                },
                items: {
                  properties: {
                    columns1: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '序号',
                        onCell: (row: any) => {
                          return {
                            colSpan: row?.gasType?.includes('CO₂e') ? 2 : 1,
                          };
                        },
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_, index) => `${index}`,
                          },
                        ),
                      },
                    },
                    columns2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '相关设施/活动',
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_, index) => `${index}`,
                          },
                        ),
                      },
                    },
                    columns3: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '活动数据',
                      },
                      properties: {
                        factorValue: renderFormItemSchema({
                          validateTitle: '活动数据',
                          'x-component': 'NumberPicker',
                          'x-decorator-props': {
                            addonAfter: 't',
                          },
                        }),
                      },
                    },
                    columns4: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '排放因子',
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_, index) => `${index}`,
                          },
                        ),
                      },
                    },
                    columns5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '排放量（tCO₂e）',
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_, index) => `${index}`,
                          },
                        ),
                      },
                    },
                    columns6: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: 'GHG分类',
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_, index) => `${index}`,
                          },
                        ),
                      },
                    },
                    columns7: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: 'ISO分类',
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_, index) => `${index}`,
                          },
                        ),
                      },
                    },
                    columns8: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: 'ISO分类',
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: (_, index) => `${index}`,
                          },
                        ),
                      },
                    },
                    // 操作
                    column5: renderFormilyTableAction({
                      actionBtns: ({ index, array }) => [
                        {
                          label: '详情',
                          key: 'del',
                          onClick: async () => {
                            array.field.remove(index);
                          },
                        },
                      ],
                      width: 120,
                      wrapperProps: {
                        'x-component-props': {
                          fixed: 'right',
                        },
                      },
                    }),
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};
