/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-21 11:00:25
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';
import {
  RegUscc,
  RegEmail,
  RegMobile,
} from '@/views/supplyChainCarbonManagement/utils';

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
          orgId: renderFormItemSchema({
            title: '所属组织',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
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
            'x-validator': (value: string) => {
              if (!value) return '';
              if (RegUscc(value)) return '';
              return '仅支持大写英文字母、数字';
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
            'x-component': 'NumberPicker',
            'x-component-props': {
              maxLength: 11,
            },
            'x-validator': (value: number) => {
              if (!value) return '';
              if (RegMobile(value)) return '';
              return '请输入正确的手机';
            },
          }),
          contactEmail: renderFormItemSchema({
            title: '联系人邮箱',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
            'x-validator': (value: string) => {
              if (!value) return '';
              if (RegEmail(value)) return '';
              return '请输入正确的邮箱';
            },
          }),
          empty: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-reactions': {
              dependencies: ['companyCode'],
              fulfill: {
                schema: {
                  'x-visible': '{{!!!$deps[0]}}',
                },
              },
            },
          }),
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
