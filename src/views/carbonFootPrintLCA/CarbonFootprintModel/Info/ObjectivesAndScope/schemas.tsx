import moment, { Moment } from 'moment';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

import { options } from './constant';
import style from './index.module.less';

/** 目标与范围的schemas */
export const schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 3,
        }),
        properties: {
          name: renderFormItemSchema({
            title: '模型名称',
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
              allowClear: true,
            },
          }),
          productId: renderFormItemSchema({
            title: '产品',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
            },
          }),
          functionalUnit: renderFormItemSchema({
            title: '功能单位',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          basicStream: {
            type: 'void',
            title: '基准流',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-component-props': {
              className: style.gridWrapper,
            },
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
            ],
            properties: {
              baselineFlowCount: renderFormItemSchema({
                validateTitle: '数量',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '请输入',
                  stringMode: true,
                  formatter: (v: string | number) => `${v}`,
                  precision: 6,
                  min: 0.000001,
                  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                  max: 9999999999.999999,
                },
              }),
              baselineFlowUnit: renderFormItemSchema({
                validateTitle: '数量单位',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: '请选择',
                  displayRender: (label: string[]) => {
                    if (!label) return '';
                    return label.slice(-1);
                  },
                  showSearch: true,
                },
              }),
            },
          },
          productWeight: {
            type: 'void',
            title: '单位产品重量',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-component-props': {
              className: style.gridWrapper,
            },
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
            ],
            properties: {
              unitProductWeight: renderFormItemSchema({
                validateTitle: '数量',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '请输入',
                  stringMode: true,
                  formatter: (v: string | number) => `${v}`,
                  precision: 6,
                  min: 0.000001,
                  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                  max: 9999999999.999999,
                },
              }),
              unitProductWeightUnit: renderFormItemSchema({
                validateTitle: '单位产品重量单位',
                'x-component': 'Select',
                'x-component-props': {
                  showSearch: true,
                  optionFilterProp: 'label',
                  allowClear: true,
                },
              }),
            },
          },
          '[startDate, endDate]': renderFormItemSchema({
            title: '生产周期',
            'x-component': 'DatePicker.RangePicker',
            'x-component-props': {
              placeholder: ['开始日期', '结束日期'],
              className: style.datePicker,
              disabledDate: (current: Moment) => {
                return (
                  (current && current < moment('1990')) ||
                  (current && current > moment())
                );
              },
            },
          }),
          productOriginInfo: {
            required: false,
            type: 'void',
            title: '产品产地',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'FormGrid',
            'x-component-props': {
              className: style.gridWrapper,
            },
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
            ],
            properties: {
              productOrigin: renderFormItemSchema({
                validateTitle: '产品产地',
                'x-component': 'Select',
                'x-component-props': {
                  showSearch: true,
                  optionFilterProp: 'label',
                  allowClear: true,
                },
              }),
              productOriginDetail: renderFormItemSchema({
                required: false,
                validateTitle: '详细地址',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
            },
          },
          researchTarget: renderFormItemSchema({
            title: '研究目标',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              maxLength: 1000,
            },
          }),
          emptyOne: renderEmptySchema(),
          systemBoundaryType: renderFormItemSchema({
            title: '系统边界',
            'x-decorator-props': {
              gridSpan: 3,
            },
            enum: options,
            'x-component': 'FormilySystemBoundaryRadio',
          }),
          systemBoundary: renderFormItemSchema({
            title: '生命周期阶段',
            required: false,
            'x-component': 'Input',
            'x-hidden': true,
          }),
          systemBoundaryImg: renderFormItemSchema({
            title: '系统边界图',
            required: false,
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'FormilyPictureCardUpload',
            'x-component-props': {
              fileType: '.jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.gif,.GIF',
              maxCount: 1,
              maxSize: 5,
            },
          }),
          systemBoundaryDesc: renderFormItemSchema({
            title: '系统边界描述',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              maxLength: 1000,
            },
          }),
          emptyTwo: renderEmptySchema(),
          cutoffRule: renderFormItemSchema({
            title: '截止规则',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              maxLength: 1000,
            },
          }),
          emptyThree: renderEmptySchema(),
          assumptionsAndConstraints: renderFormItemSchema({
            title: '假设和限制',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              maxLength: 1000,
            },
          }),
        },
      },
    },
  );
