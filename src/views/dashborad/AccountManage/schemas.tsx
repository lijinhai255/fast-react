import { ISchema } from '@formily/react';

import {
  renderFormItemSchema,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { changePwdSchemas } from '@/views/base/ChangePWD/utils';

export const schema = ({
  onChangePwd,
}: {
  onChangePwd: () => Promise<any>;
}): ISchema => ({
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
          ...renderFromGridSchema(),

          properties: {
            username: renderFormItemSchema({
              title: '用户名',
              'x-component': 'Input',
            }),
            btn: renderFormItemSchema({
              title: '',
              'x-disabled': false,
              'x-decorator-props': {
                gridSpan: 2,
                style: {
                  alignSelf: 'end',
                },
              },
              'x-component-props': {
                onClick: async () => {
                  onChangePwd();
                },
                children: '修改密码',
                type: 'link',
              },
              'x-component': 'Button',
            }),
            realName: renderFormItemSchema({
              title: '姓名',
              'x-component': 'Input',
            }),
            mobile: renderFormItemSchema({
              title: '手机号',
              'x-component': 'Input',
            }),
            email: renderFormItemSchema({
              title: '邮箱',
              'x-component': 'Input',
            }),
            orgs: renderFormItemSchema({
              title: '所属组织',
              'x-component': 'Input',
            }),
            roles: renderFormItemSchema({
              title: '用户角色',
              'x-component': 'Input',
            }),
          },
        },
      },
    },
  },
});

/** 修改密码 */
export const changePwdSchema = (): ISchema => ({
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'vertical',
      },
      properties: {
        oldPassword: {
          type: 'string',
          title: '旧密码',
          'x-decorator': 'FormItem',
          'x-validator': [{ required: true, message: '请输入旧密码' }],
          'x-component': 'Password',
          'x-component-props': {
            placeholder: '请输入',
            maxLength: 100,
          },
        },
        ...changePwdSchemas(),
      },
    },
  },
});
