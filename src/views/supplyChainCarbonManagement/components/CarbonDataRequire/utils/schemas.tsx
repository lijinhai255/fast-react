/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-13 11:45:01
 */

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

/** 公用的schemas */
export const commonSchemas = (isFill: boolean) => {
  return {
    applyRealName: renderFormItemSchema({
      title: isFill ? '联系人姓名' : '申请人',
      'x-component': 'Input',
    }),
    applyMobile: renderFormItemSchema({
      title: isFill ? '联系方式' : '申请人联系方式',
      'x-component': 'Input',
    }),
    applyTime: renderFormItemSchema({
      title: '申请时间',
      'x-component': 'Input',
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
        style: {
          height: 100,
          alignItems: 'flex-start',
        },
      },
    }),
  };
};

/** 产品碳足迹数据请求的schemas */
export const productInfoSchema = (isFill: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          companyName: renderFormItemSchema({
            title: '客户名称',
            required: false,
            'x-component': 'Input',
            'x-visible': isFill,
          }),
          productName: renderFormItemSchema({
            title: isFill ? '产品名称' : '采购产品',
            required: false,
            'x-component': 'Input',
          }),
          productUnit: renderFormItemSchema({
            title: '核算单位',
            required: false,
            'x-component': 'Input',
          }),
          productModel: renderFormItemSchema({
            title: '规格/型号',
            required: false,
            'x-component': 'Input',
          }),

          deadline: renderFormItemSchema({
            title: '截止日期',
            'x-component': 'DatePicker',
            'x-component-props': {
              showToday: false,
              format: 'YYYY-MM-DD',
            },
          }),
          applyType_name: renderFormItemSchema({
            title: '数据请求类型',
            'x-component': 'Radio.Group',
          }),
          empty: renderEmptySchema({
            'x-visible': !isFill,
          }),
          periodType_name: renderFormItemSchema({
            title: '系统边界要求',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'Radio.Group',
          }),
          ...commonSchemas(isFill),
        },
      },
    },
  );
/** 企业碳核算的数据请求schemas */
export const enterpriseInfoSchema = (isFill: boolean) =>
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
            'x-visible': !isFill,
          }),
          companyName: renderFormItemSchema({
            title: '客户名称',
            required: false,
            'x-component': 'Input',
            'x-visible': isFill,
          }),
          orgName: renderFormItemSchema({
            title: '核算企业',
            required: false,
            'x-component': 'Input',
            'x-visible': isFill,
          }),
          year: renderFormItemSchema({
            title: '核算年份',
            'x-component': 'Input',
          }),
          deadline: renderFormItemSchema({
            title: '截止日期',
            'x-component': 'DatePicker',
            'x-component-props': {
              showToday: false,
              format: 'YYYY-MM-DD',
            },
          }),
          applyType_name: renderFormItemSchema({
            title: '数据请求类型',
            'x-component': 'Radio.Group',
          }),
          standardTypes: renderFormItemSchema({
            title: '企业碳核算标准',
            'x-component': 'Checkbox.Group',
          }),
          empty: renderEmptySchema({
            'x-visible': !isFill,
          }),
          ghgCategories: renderFormItemSchema({
            title: '核算范围（GHG Protocol）',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'Checkbox.Group',
            'x-reactions': {
              dependencies: ['standardTypes'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0] && $deps[0].includes(1)}}',
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
                  'x-visible': '{{$deps[0] && $deps[0].includes(2)}}',
                },
              },
            },
          }),
          ...commonSchemas(isFill),
        },
      },
    },
  );
/** 低碳问卷数据要求的schemas */
export const questionnaireInfoSchema = (isFill: boolean) =>
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
            'x-visible': !isFill,
          }),
          companyName: renderFormItemSchema({
            title: '客户名称',
            required: false,
            'x-component': 'Input',
            'x-visible': isFill,
          }),
          deadline: renderFormItemSchema({
            title: '截止日期',
            'x-component': 'DatePicker',
            'x-component-props': {
              showToday: false,
              format: 'YYYY-MM-DD',
            },
          }),
          dataType_name: renderFormItemSchema({
            title: '数据请求类型',
            'x-component': 'Radio.Group',
          }),
          applyRealName: renderFormItemSchema({
            title: isFill ? '联系人' : '申请人',
            'x-component': 'Input',
          }),
          applyMobile: renderFormItemSchema({
            title: isFill ? '联系方式' : '申请人联系方式',
            'x-component': 'Input',
          }),
          applyTime: renderFormItemSchema({
            title: '申请时间',
            'x-component': 'Input',
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
