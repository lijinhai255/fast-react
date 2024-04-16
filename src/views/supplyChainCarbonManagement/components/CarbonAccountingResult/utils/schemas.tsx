/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:57:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:26:36
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { RegValue } from '@/views/supplyChainCarbonManagement/utils';

const validatorValueFn = (value: number) =>
  RegValue(
    value,
    9999999999.999,
    -9999999999.999,
    3,
    '取值范围：-9999999999.999-9999999999.999',
  );

export const basicSchema = (hasAction?: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          supplierName: renderFormItemSchema({
            title: '供应商名称',
            'x-component': 'Input',
            'x-disabled': true,
            'x-visible': !hasAction,
          }),
          orgName: renderFormItemSchema({
            title: '碳核算企业',
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
            'x-visible': hasAction,
          }),
          year: renderFormItemSchema({
            title: '核算年份',
            required: false,
            'x-component': 'Input',
            'x-disabled': true,
          }),
          total: renderFormItemSchema({
            title: '排放总量（tCO₂e）',
            'x-component': 'NumberPicker',
            'x-validator': (value: number) => validatorValueFn(value),
          }),
        },
      },
    },
  );

export const ghgSchema = (ghgCategoriesCode?: number[]) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          scopeOne: renderFormItemSchema({
            title: '范围一排放量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': ghgCategoriesCode && ghgCategoriesCode.includes(1),
            'x-reactions': {
              target: '.scopeOne',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          scopeTwo: renderFormItemSchema({
            title: '范围二排放量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': ghgCategoriesCode && ghgCategoriesCode.includes(2),
            'x-reactions': {
              target: '.scopeTwo',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          scopeThree: renderFormItemSchema({
            title: '范围三排放量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': ghgCategoriesCode && ghgCategoriesCode.includes(3),
            'x-reactions': {
              target: '.scopeThree',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
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

export const isoSchema = (isoCategoriesCode?: number[]) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          direct: renderFormItemSchema({
            title: '直接排放或清除量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(1),
            'x-reactions': {
              target: '.direct',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          energy: renderFormItemSchema({
            title: '能源间接排放量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(2),
            'x-reactions': {
              target: '.energy',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          transport: renderFormItemSchema({
            title: '运输间接排放量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(3),
            'x-reactions': {
              target: '.transport',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          outsourcing: renderFormItemSchema({
            title: '外购产品或服务间接排放量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(4),
            'x-reactions': {
              target: '.outsourcing',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          supplyChain: renderFormItemSchema({
            title: '供应链下游排放量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(5),
            'x-reactions': {
              target: '.supplyChain',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
                },
              },
              otherwise: {
                state: {
                  required: false,
                },
              },
            },
          }),
          rests: renderFormItemSchema({
            title: '其他间接排放量（tCO₂e）',
            required: false,
            'x-component': 'NumberPicker',
            'x-visible': isoCategoriesCode && isoCategoriesCode.includes(6),
            'x-reactions': {
              target: '.rests',
              when: '{{!!$self.value}}',
              fulfill: {
                state: {
                  required: true,
                  validator: (value: number) => validatorValueFn(value),
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
