/* eslint-disable @typescript-eslint/no-loss-of-precision */

/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 15:31:36
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:20:22
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';
import { RegValue } from '@/views/supplyChainCarbonManagement/utils';

const validatorStageValue = (value: number) =>
  RegValue(
    value,
    9999999999.999999,
    -9999999999.999999,
    6,
    '取值范围：-9999999999.999999-9999999999.999999',
  );

export const schema = (currentModalType?: string, periodType?: 1 | 2) =>
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
            'x-disabled': true,
            'x-visible': currentModalType === 'supplierSelect',
          }),
          productName: renderFormItemSchema({
            title: '产品名称',
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          productUnit: renderFormItemSchema({
            title: '核算单位',
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          productModel: renderFormItemSchema({
            title: '规格/型号',
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          total: renderFormItemSchema({
            title: `单位产品排放量-${
              periodType && Number(periodType) === 1 ? '半' : '全'
            }生命周期（kgCO₂e）`,
            'x-component': 'Input',
            'x-component-props': {
              type: 'number',
              className: 'inputNumberWrapper',
            },
            'x-validator': (value: number) =>
              // @ts-ignore
              validatorStageValue(value),
          }),
          year: renderFormItemSchema({
            title: '核算年份',
            'x-component': 'Select',
          }),
          empty: renderEmptySchema({
            'x-visible': currentModalType !== 'supplierSelect',
          }),
          materialStage: renderFormItemSchema({
            title: '单位产品排放量-原材料获取阶段（kgCO₂e）',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              type: 'number',
              className: 'inputNumberWrapper',
            },
            'x-reactions': {
              target: '.materialStage',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) =>
                    // @ts-ignore
                    validatorStageValue(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          produceStage: renderFormItemSchema({
            title: '单位产品排放量-生产制造阶段（kgCO₂e）',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              type: 'number',
              className: 'inputNumberWrapper',
            },
            'x-reactions': {
              target: '.produceStage',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) =>
                    // @ts-ignore
                    validatorStageValue(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          storageStage: renderFormItemSchema({
            title: '单位产品排放量-分销和储存阶段（kgCO₂e）',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              type: 'number',
              className: 'inputNumberWrapper',
            },
            'x-reactions': {
              target: '.storageStage',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) =>
                    // @ts-ignore
                    validatorStageValue(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          useStage: renderFormItemSchema({
            title: '单位产品排放量-产品使用阶段（kgCO₂e）',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              type: 'number',
              className: 'inputNumberWrapper',
            },
            'x-visible': periodType && Number(periodType) === 2,
            'x-reactions': {
              target: '.useStage',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) =>
                    // @ts-ignore
                    validatorStageValue(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          discardStage: renderFormItemSchema({
            title: '单位产品排放量-废弃处置阶段（kgCO₂e）',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              type: 'number',
              className: 'inputNumberWrapper',
            },
            'x-visible': periodType && Number(periodType) === 2,
            'x-reactions': {
              target: '.discardStage',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) =>
                    // @ts-ignore
                    validatorStageValue(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
        },
      },
    },
  );
