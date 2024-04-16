/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-22 16:28:31
 */
import { ISchema } from '@formily/react';

import { renderFromGridSchema } from '@/components/formily/utils';

export const schema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
          // className: style.gridWrapper,
        },
        properties: {
          grid: {
            ...renderFromGridSchema(),
            properties: {
              orgName: {
                type: 'string',
                title: '组织名称',
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-validator': [{ required: true, message: '请输入组织名称' }],
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: 100,
                },
              },
              orgAbbr: {
                type: 'string',
                title: '组织简称',
                required: true,
                'x-validator': [{ required: true, message: '请输入组织简称' }],
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: 50,
                },
              },
              orgCode: {
                type: 'string',
                title: '组织编码',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                // 'x-validator': [
                //   // eslint-disable-next-line consistent-return
                //   (value: string) => {
                //     if (!value) return Promise.resolve('请输入组织编码');

                //     if (!/^[a-zA-Z0-9]+$/.test(value))
                //       return Promise.resolve('组织编码格式不正确');
                //   },
                // ],
                'x-validator': [
                  { required: true, message: '请输入组织编码' },
                  { pattern: /^[a-zA-Z0-9]+$/, message: '组织编码格式不正确' },
                ],
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: 50,
                },
              },
              orgType: {
                type: 'string',
                title: '组织类型',
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-component': 'Select',
                'x-component-props': {
                  disabled: true,
                  placeholder: '请输入',
                },
                enum: [
                  { label: '单体组织', value: '0' },
                  { label: '集团', value: '1' },
                  { label: '子组织', value: '2' },
                  { label: '部门', value: '3' },
                ],
              },
              pId: {
                type: 'string',
                title: '上级组织',
                required: true,
                'x-decorator': 'FormItem',
                // todo 目前后端逻辑这里不能修改
                // 'x-component': 'TreeSelect',
                'x-component': 'Input',
                'x-decorator-props': {
                  gridSpan: 1,
                },
                'x-component-props': {
                  placeholder: '请选择',
                  disabled: true,
                },
                'x-reactions': [
                  {
                    dependencies: ['orgType'],
                    fulfill: {
                      state: {
                        display: `{{Number($deps[0]) > 1 ? 'visible':'visable'}}`,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  };
};
