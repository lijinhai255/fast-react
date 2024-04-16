/*
 * @@description: 表单配置项
 */
import { ISchema } from '@formily/react';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { PageTypeInfo } from '@/router/utils/enums';
import { mobileReg } from '@/utils/regs';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (pageTypeInfo: PageTypeInfo): ISchema => {
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
              maxColumns: 3,
              minColumns: 3,
            },
            properties: {
              realName: {
                type: 'string',
                title: `姓名`,
                'x-validator': [
                  { required: true, message: '请输入姓名' },
                  (value: string) => {
                    if (value === '-') {
                      return `姓名不可仅为 "-"`;
                    }
                    return '';
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: 100,
                },
              },
              mobile: {
                type: 'string',
                title: `手机号`,
                'x-validator': [
                  { required: true, message: '请输入手机号' },
                  (val: string) => {
                    if (!val) return '';
                    if (mobileReg(val)) return '';
                    return '手机号格式不正确';
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  disabled: pageTypeInfo === PageTypeInfo.edit,
                  placeholder: '请输入',
                  maxLength: 11,
                },
              },
              deptId: {
                type: 'string',
                title: '所属分组',
                'x-validator': [{ required: true, message: '请选择所属分组' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              },
              userNumber: {
                type: 'string',
                title: `用户ID`,
                'x-validator': [
                  { required: false, message: '请输入用户ID' },
                  (value: string) => {
                    if (value === '-') {
                      return `用户ID不可仅为 "-"`;
                    }
                    return '';
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  disabled: pageTypeInfo === PageTypeInfo.edit,
                  placeholder: '请输入',
                  maxLength: 50,
                },
              },
            },
          },
        },
      },
    },
  };
};
