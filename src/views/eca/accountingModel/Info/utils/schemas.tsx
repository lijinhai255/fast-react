/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-14 16:18:27
 */
import { ISchema } from '@formily/react';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { InputTextLength200 } from '@/views/eca/util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (
  status?: 'ADD' | 'EDIT' | 'COPY' | 'SHOW' | 'DEL',
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
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              modelName: {
                type: 'string',
                title: `模型名称`,
                'x-validator': [
                  { required: true, message: '请输入模型名称' },
                  (value: string) => {
                    if (value === '-') {
                      return `模型名称不可仅为 "-"`;
                    }
                    return '';
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: 50,
                },
              },
              orgId: {
                type: 'string',
                title: '所属组织',
                'x-validator': [{ required: true, message: '请选择所属组织' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: status === 'EDIT',
                  placeholder: '请选择',
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              },
              intro: {
                type: 'string',
                title: '模型简介',
                // 'x-validator': [{ required: true, message: '请输入模型简介' }],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength200,
                  alignItems: 'flex-start',
                },
              },
            },
          },
        },
      },
    },
  };
};
