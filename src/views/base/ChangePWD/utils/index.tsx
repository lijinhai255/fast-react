/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-08 10:13:23
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-22 11:08:44
 */
import { SchemaProperties } from '@formily/react';

import { pwdReg } from '@/utils/regs';
import { InputTextLength100 } from '@/views/eca/util/type';

const validatePwd = (dependencies: string[]) => {
  return [
    {
      dependencies,
      fulfill: {
        state: {
          selfErrors:
            '{{ !$self.errors.length && ($deps[0] && $self.value && $self.value !== $deps[0] ? "您输入的密码不一致" : "")}}',
        },
      },
    },
  ];
};

export const changePwdSchemas = (): SchemaProperties<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> => {
  return {
    newPassword: {
      type: 'string',
      title: '新密码',
      'x-decorator': 'FormItem',
      'x-validator': [
        { required: true, message: '请输入新密码' },
        // eslint-disable-next-line
        (val: string) => {
          if (!val) return '';
          if (!pwdReg(val)) {
            return '密码格式不正确';
          }
        },
      ],
      'x-reactions': validatePwd(['.confirmNewPwd']),

      'x-component': 'Password',
      'x-component-props': {
        placeholder: '请输入',
        maxLength: InputTextLength100,
      },
    },
    confirmNewPwd: {
      type: 'string',
      required: true,
      title: '确认新密码',
      'x-validator': [
        { required: true, message: '请输入确认密码' },
        // eslint-disable-next-line consistent-return
        (val: string) => {
          if (!val) return '';
          if (!pwdReg(val)) {
            return '密码格式不正确';
          }
        },
      ],
      'x-decorator': 'FormItem',
      'x-reactions': validatePwd(['.newPassword']),
      'x-component': 'Password',
      'x-component-props': {
        placeholder: '请输入',
        maxLength: InputTextLength100,
      },
    },
  };
};
