/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-29 18:46:07
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          supplierName: renderFormItemSchema({
            title: '供应商名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          orgName: renderFormItemSchema({
            title: '所属组织',
            'x-component': 'Input',
            'x-disabled': true,
          }),
          supplierCode: renderFormItemSchema({
            title: '供应商编码',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
          uscc: renderFormItemSchema({
            title: '社会信用代码',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 18,
            },
            'x-disabled': true,
          }),
          empty: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          contactName: renderFormItemSchema({
            title: '联系人',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
          contactMobile: renderFormItemSchema({
            title: '联系人手机',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 11,
            },
          }),
          contactEmail: renderFormItemSchema({
            title: '联系人邮箱',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
            'x-validator': [
              {
                pattern:
                  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                message: '请输入正确邮箱格式',
              },
            ],
          }),
          unitDischarge: renderFormItemSchema({
            title: '单位产品排放量（kgCO₂e/核算单位）',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
          unitPrice: renderFormItemSchema({
            title: '单价（元）',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
          empty1: renderEmptySchema(),
          remark: renderFormItemSchema({
            title: '备注',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 1000,
              style: {
                height: 100,
                alignItems: 'flex-start',
              },
            },
          }),
        },
      },
    },
  );
