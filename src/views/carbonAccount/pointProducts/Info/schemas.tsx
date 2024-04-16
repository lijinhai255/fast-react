/*
 * @@description: 表单配置项
 */

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderEmptySchema,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { RegCarbonAccountValue } from '@/views/carbonAccount/util';

export const schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          goodsName: renderFormItemSchema({
            title: '商品名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          empty: renderEmptySchema(),
          empty1: renderEmptySchema(),
          imgPath: renderFormItemSchema({
            title: '商品图',
            // 'x-validator': [{ required: true, message: '请上传图片' }],
            'x-decorator-props': {
              gridSpan: 1,
              extra: !window.location.pathname.includes('show')
                ? `支持JPG、JPEG、PNG、GIF格式,
                图片最大限制5M，建议500x500像素`
                : '',
            },
            'x-component': 'CardUpload',
            'x-component-props': {
              maxCount: 1,
            },
          }),
          empty2: renderEmptySchema(),
          empty3: renderEmptySchema(),
          score: renderFormItemSchema({
            title: '兑换积分',
            type: 'number',
            'x-component': 'NumberPicker',
            'x-component-props': {
              precision: 0,
            },
            'x-validator': (value: string) => RegCarbonAccountValue(value),
          }),
          countLimit: renderFormItemSchema({
            title: '限兑数量',
            type: 'number',
            'x-component': 'NumberPicker',
            'x-component-props': {
              precision: 0,
            },
            'x-validator': (value: string) =>
              RegCarbonAccountValue(value, 10000),
          }),
          limitNo: renderFormItemSchema({
            title: '投放渠道',
            'x-component': 'Radio.Group',
            default: 0,
            enum: [
              { label: '全渠道', value: 0 },
              { label: '指定渠道', value: 1 },
            ],
          }),
          deptId: renderFormItemSchema({
            title: '指定渠道',
            type: 'array',
            'x-component': 'Select',
            'x-component-props': {
              fieldNames: {
                value: 'value',
                label: 'label',
              },
              showArrow: true,
              mode: 'multiple',
            },
            'x-reactions': [
              {
                dependencies: ['limitNo'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] === 1}}',
                  },
                },
              },
            ],
          }),
          sendType: renderFormItemSchema({
            title: '发货方式',
            'x-component': 'Radio.Group',
            default: 0,
            enum: [
              { label: '自动发货', value: 0 },
              { label: '手动发货', value: 1 },
            ],
          }),
          goodsStatus: renderFormItemSchema({
            title: '状态',
            'x-component': 'Radio.Group',
            default: 0,
            enum: [
              { label: '未上架', value: 0 },
              { label: '已上架', value: 1 },
            ],
          }),
          orderNum: renderFormItemSchema({
            title: '排序',
            type: 'number',
            'x-component': 'NumberPicker',
            'x-component-props': {
              precision: 0,
            },
            'x-validator': (value: string) =>
              RegCarbonAccountValue(value, undefined, true),
          }),
        },
      },
    },
  );
