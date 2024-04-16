/* eslint-disable @typescript-eslint/no-loss-of-precision */
/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-01 09:59:03
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';
import { RegValue } from '@/views/supplyChainCarbonManagement/utils';

export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          productName: renderFormItemSchema({
            title: '产品名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          productUnit: renderFormItemSchema({
            title: '核算单位',
            'x-component': 'Cascader',
            'x-component-props': {
              placeholder: '请选择单位',
            },
          }),
          productModel: renderFormItemSchema({
            title: '规格/型号',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          unitDischarge: renderFormItemSchema({
            title: '单位产品排放量（kgCO₂e/核算单位）',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              type: 'number',
              className: 'inputNumberWrapper',
            },
            'x-reactions': {
              target: '.unitDischarge',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) =>
                    // @ts-ignore
                    RegValue(
                      value,
                      9999999999.999999,
                      -9999999999.999999,
                      6,
                      '取值范围：-9999999999.999999-9999999999.999999',
                    ),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          unitPrice: renderFormItemSchema({
            title: '单价（元）',
            required: false,
            'x-component': 'NumberPicker',
            'x-component-props': {
              controls: false,
            },
            'x-reactions': {
              target: '.unitPrice',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) =>
                    // @ts-ignore
                    RegValue(
                      value,
                      9999999999.9999,
                      0,
                      4,
                      '取值范围0-9999999999.9999',
                    ),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          empty: renderEmptySchema(),
          productDesc: renderFormItemSchema({
            title: '产品描述',
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
