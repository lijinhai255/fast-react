/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-30 15:31:23
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
          year: renderFormItemSchema({
            title: '核算年份',
            'x-component': 'Select',
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
          standardTypes: renderFormItemSchema({
            title: '企业碳核算标准',
            'x-component': 'Checkbox.Group',
            default: [1],
          }),
          empty: renderEmptySchema(),
          ghgCategories: renderFormItemSchema({
            title: '核算范围（GHG Protocol）',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'Checkbox.Group',
            default: [1, 2],
            'x-reactions': {
              dependencies: ['standardTypes'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0].includes(1)}}',
                },
              },
            },
          }),
          isoCategories: renderFormItemSchema({
            title: '核算范围（ISO 14064-1:2018）',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'Checkbox.Group',
            'x-reactions': {
              dependencies: ['standardTypes'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0].includes(2)}}',
                },
              },
            },
          }),
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
