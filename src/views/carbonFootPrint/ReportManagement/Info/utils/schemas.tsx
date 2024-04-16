/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-20 23:43:08
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-04-13 18:29:21
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

/** 碳足迹报告-详情-基本信息schema */
export const basicInfoSchema = (isAdd: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          reportName: renderFormItemSchema({
            title: '报告名称',
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
            'x-disabled': !isAdd,
          }),
          functionalUnit: renderFormItemSchema({
            title: '功能单位',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
          }),
          productionName: renderFormItemSchema({
            title: '产品名称',
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          '[beginDate, endTime]': renderFormItemSchema({
            title: '核算周期',
            'x-component': 'DatePicker.RangePicker',
            'x-component-props': {
              placeholder: ['开始日期', '结束日期'],
            },
            'x-disabled': true,
          }),
        },
      },
    },
  );

/** 碳足迹报告-详情-报告信息schema */
export const reportInfoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          orgMsg: renderFormItemSchema({
            title: '企业简介',
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
          empty: renderEmptySchema(),
          carbonMsg: renderFormItemSchema({
            title: '产品碳足迹评价的假设',
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
              maxLength: 2000,
            },
          }),
        },
      },
    },
  );

/** 碳足迹报告-详情-数据质量评价-活动数据schema  */
export const activityDataTableSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      reportActive: {
        type: 'array',
        'x-component': 'ArrayTable',
        'x-decorator': 'FormItem',
        'x-component-props': {
          pagination: false,
        },
        items: {
          properties: {
            columns1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '数据类别',
              },
              properties: {
                modelName: renderEmptySchema(
                  { type: 'string' },
                  {
                    showVal: row => row?.modelName,
                  },
                ),
              },
            },
            columns2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '活动数据描述',
              },
              properties: {
                msg: renderFormItemSchema({
                  validateTitle: '活动数据描述',
                  required: false,
                  'x-component': 'TextArea',
                  'x-component-props': {
                    placeholder: '请输入',
                    maxLength: 200,
                    style: {
                      height: 100,
                      alignItems: 'flex-start',
                    },
                    autoSize: {
                      minRows: 1,
                    },
                  },
                }),
              },
            },
            columns3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '活动数据类型' },
              properties: {
                activeType: renderFormItemSchema({
                  validateTitle: '活动数据类型',
                  required: false,
                  'x-component': 'Select',
                }),
              },
            },
          },
        },
      },
    },
  );

/** 碳足迹报告-详情-数据质量评价-排放因子schema */
export const factorTableSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      reportFactor: {
        type: 'array',
        'x-component': 'ArrayTable',
        'x-decorator': 'FormItem',
        'x-component-props': {
          pagination: false,
        },
        items: {
          properties: {
            columns1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '数据类别',
              },
              properties: {
                modelName: renderEmptySchema(
                  { type: 'string' },
                  {
                    showVal: row => row?.modelName,
                  },
                ),
              },
            },
            columns2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '排放因子描述',
              },
              properties: {
                msg: renderFormItemSchema({
                  validateTitle: '排放因子描述',
                  required: false,
                  'x-component': 'TextArea',
                  'x-component-props': {
                    placeholder: '请输入',
                    maxLength: 200,
                    style: {
                      height: 100,
                      alignItems: 'flex-start',
                    },
                    autoSize: {
                      minRows: 1,
                    },
                  },
                }),
              },
            },
            columns3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '时间相关性' },
              properties: {
                timeCorrelation: renderFormItemSchema({
                  validateTitle: '时间相关性',
                  required: false,
                  'x-component': 'Select',
                }),
              },
            },
            columns4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '地域相关性' },
              properties: {
                zoneCorrelation: renderFormItemSchema({
                  validateTitle: '地域相关性',
                  required: false,
                  'x-component': 'Select',
                }),
              },
            },
            columns5: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '技术相关性' },
              properties: {
                technologyCorrelation: renderFormItemSchema({
                  validateTitle: '技术相关性',
                  required: false,
                  'x-component': 'Select',
                }),
              },
            },
            columns6: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '数据准确度' },
              properties: {
                dataAccuracy: renderFormItemSchema({
                  validateTitle: '数据准确度',
                  required: false,
                  'x-component': 'Select',
                }),
              },
            },
            columns7: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '方法学的适合性' },
              properties: {
                methodology: renderFormItemSchema({
                  validateTitle: '方法学适合性',
                  required: false,
                  'x-component': 'Select',
                }),
              },
            },
          },
        },
      },
    },
  );
