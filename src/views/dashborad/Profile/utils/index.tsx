/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-29 17:41:21
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-05-30 14:10:48
 */
import { ISchema } from '@formily/react';

import { renderFromGridSchema } from '@/components/formily/utils';
import { checkAuth } from '@/layout/utills';
import { emailReg, mobileReg } from '@/utils/regs';
import { changePwdSchemas } from '@/views/base/ChangePWD/utils';
import { InputTextLength100 } from '@/views/eca/util/type';

import style from '../index.module.less';

export const schema = ({
  onChangePwd,
  showChangePwd,
  isUserProfilePage,
}: {
  showChangePwd: boolean;
  isUserProfilePage: boolean;
  onChangePwd: () => Promise<any>;
}): ISchema => ({
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
            username: {
              type: 'string',
              title: '用户名',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                gridSpan: showChangePwd ? 1 : 3,
                className: style.grid,
              },
              'x-validator': [{ required: true, message: '请输入用户名' }],
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
                maxLength: 50,
              },
            },
            btn:
              showChangePwd &&
              // 权限检测
              ((checkAuth('/sys/user/resetPassword', true) &&
                !isUserProfilePage) ||
                isUserProfilePage)
                ? {
                    type: 'void',
                    title: '',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      gridSpan: 2,
                      className: style.grid,
                      style: {
                        alignSelf: 'end',
                      },
                    },
                    'x-component-props': {
                      onClick: async () => {
                        onChangePwd();
                      },
                      children: isUserProfilePage ? '修改密码' : '重置密码',
                      type: 'link',
                      className: style.changePwd,
                    },
                    'x-component': 'Button',
                  }
                : {},
            realName: {
              type: 'string',
              title: '姓名',
              'x-validator': [{ required: true, message: '请输入姓名' }],
              'x-decorator-props': {
                gridSpan: 1,
                className: style.grid,
              },
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
                maxLength: 50,
              },
            },
            mobile: {
              type: 'string',
              title: '手机号',
              'x-decorator-props': {
                gridSpan: 1,
                className: style.grid,
              },
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
                maxLength: 11,
                placeholder: '请输入',
              },
            },
            /**
             * TODO 新增邮箱 1.0.3
             * **/
            email: {
              type: 'string',
              title: '邮箱',
              'x-decorator-props': {
                gridSpan: 1,
                className: style.grid,
              },
              'x-validator': [
                { required: true, message: '请输入邮箱' },
                (val: string) => {
                  if (!val) return '';
                  if (emailReg(val)) return '';
                  return '邮箱格式不正确';
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                maxLength: 100,
                placeholder: '请输入',
              },
            },
            orgs: {
              type: 'string',
              title: '所属组织',
              'x-validator': [{ required: true, message: '请输入所属组织' }],
              'x-decorator-props': {
                gridSpan: 3,
                className: style.grid1Row,
              },
              'x-decorator': 'FormItem',
              'x-component': 'TreeSelect',
              'x-component-props': {
                placeholder: '请选择',
                fieldNames: { label: 'name', value: 'code' },
                showSearch: true,
                allowClear: true,
                treeDefaultExpandAll: true,
                filterTreeNode: (input: string, option: any) => {
                  return (option?.name ?? '').includes(input);
                },
              },
            },
            roles: {
              type: 'array',
              title: '用户角色',
              'x-validator': [
                { required: true, message: '请至少选择一个角色' },
              ],
              'x-decorator-props': {
                gridSpan: 3,
                className: style.grid1Row,
              },
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox.Group',
            },
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
            maxLength: InputTextLength100,
          },
        },
        ...changePwdSchemas(),
      },
    },
  },
});
