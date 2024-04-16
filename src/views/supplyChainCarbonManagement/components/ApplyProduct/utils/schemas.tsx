/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-30 10:03:26
 */
import moment, { Moment } from 'moment';

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
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
            'x-disabled': true,
          }),
          productName: renderFormItemSchema({
            title: '采购产品名称',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
            'x-disabled': true,
          }),
          productUnit: renderFormItemSchema({
            title: '核算单位',
            required: false,
            'x-component': 'Cascader',
            'x-component-props': {
              placeholder: '请选择单位',
            },
            'x-disabled': true,
          }),
          productModel: renderFormItemSchema({
            title: '规格/型号',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
            'x-disabled': true,
          }),
          deadline: renderFormItemSchema({
            title: '截止日期',
            'x-component': 'DatePicker',
            'x-component-props': {
              disabledDate: (current: Moment) => {
                return current && current < moment();
              },
              showToday: false,
            },
          }),
          applyType: renderFormItemSchema({
            title: '数据请求类型',
            'x-component': 'Radio.Group',

            default: 1,
          }),
          periodType: renderFormItemSchema({
            title: '系统边界要求',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Radio.Group',
            default: 1,
          }),
          empty: renderEmptySchema(),
          requireDesc: renderFormItemSchema({
            title: '数据要求描述',
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
