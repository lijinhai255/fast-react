import { Select } from '@formily/antd';

import {
  renderFromGridSchema,
  renderFormItemSchema,
  renderEmptySchema,
  switchComponents,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import { HasSubCategoryGas } from '@/views/Factors/Info/utils/schemas';
import {
  InputTextLength100,
  InputTextLength20,
  InputTextLength50,
  RegNumAndLetters,
  RegNumberFive,
  RegNumberThree,
} from '@/views/eca/util/type';
import { RegValue } from '@/views/supplyChainCarbonManagement/utils';

export const baseSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          sourceName: renderFormItemSchema({
            title: '排放源名称',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength50,
            },
          }),
          sourceCode: renderFormItemSchema({
            title: '排放源ID',
            type: 'string',
            'x-validator': RegNumAndLetters,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength20,
            },
          }),
          facility: renderFormItemSchema({
            title: '排放设施/活动',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          ghg: renderFormItemSchema({
            title: 'GHG类别',
            type: 'string',
            'x-component': 'Cascader',
          }),
          iso: renderFormItemSchema({
            title: 'ISO类别',
            type: 'string',
            'x-component': 'Cascader',
          }),
        },
      },
    },
  );

export const activityFormSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          dataValue: renderFormItemSchema({
            title: '活动数据',
            type: 'string',
            'x-component': 'NumberPicker',
            'x-validator': (value: number) =>
              RegValue(value, 99999999.9999, 0, 4, '取值范围：0-99999999.9999'),
          }),
          activityUnit: renderFormItemSchema({
            title: '活动数据单位',
            type: 'string',
            'x-component': 'Cascader',
            'x-component-props': {
              displayRender: (label: string[]) => {
                if (!label) return '';
                return label.slice(-1);
              },
              showSearch: true,
            },
          }),
          activityRecordWay: renderFormItemSchema({
            title: '活动数据记录方式',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength50,
            },
          }),
          activityDept: renderFormItemSchema({
            title: '活动数据保存部门',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength50,
            },
          }),
          activityCategory: renderFormItemSchema({
            title: '活动数据类别',
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
        },
      },
    },
  );

export const factorSchema = (
  readPretty: boolean,
  gwpObj?: { [key: string | number]: number },
) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          factorWay: renderFormItemSchema({
            type: 'string',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'SelectButton',
            enum: [
              {
                label: '排放因子',
                value: '1',
              },
              {
                label: '新建因子',
                value: '2',
              },
              {
                label: '供应商数据',
                value: '3',
              },
            ],
            default: '1',
            'x-reactions': {
              target: '*(gasList,supplierData,factorSource,year)',
              when: `{{$self.value !== '2'}}`,
              fulfill: {
                state: {
                  disabled: true,
                  required: false,
                },
              },
              otherwise: {
                state: {
                  disabled: !!readPretty,
                  required: !readPretty,
                },
              },
            },
          }),
          gasList: renderFormItemSchema({
            title: '排放因子（以下温室气体类型必填其一）',
            type: 'array',
            required: false,
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
            },
            'x-reactions': {
              dependencies: ['.factorWay'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0] !== "3"}}',
                },
              },
            },
            items: {
              properties: {
                columns1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: '温室气体类型',
                    onCell: (row: { gasType: string }) => {
                      return {
                        colSpan: row?.gasType?.includes('CO₂e') ? 2 : 1,
                      };
                    },
                  },
                  properties: {
                    gasType: renderEmptySchema(
                      { type: 'string' },
                      {
                        showVal: (row: { gasType: string }) => row?.gasType,
                      },
                    ),
                  },
                },
                columns2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: '温室气体',
                    onCell: (row: { gasType: string }) => {
                      return {
                        colSpan: row?.gasType?.includes('CO₂e') ? 0 : 1,
                      };
                    },
                  },
                  properties: {
                    gas: {
                      ...renderFormItemSchema({
                        validateTitle: '温室气体',
                        'x-component': 'Select',
                        required: false,
                      }),
                      'x-component': switchComponents<Record<string, any>>({
                        renderFn: ({ row, props }) => {
                          if (
                            Object.keys(HasSubCategoryGas).some(g =>
                              row?.gasType?.includes(g),
                            )
                          ) {
                            return (
                              <Select
                                {...props}
                                placeholder='请选择'
                                options={props.dataSource}
                                allowClear
                              />
                            );
                          }
                          return <div>{row?.gas || ''}</div>;
                        },
                      }),
                    },
                  },
                },
                columns3: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: '因子数值' },
                  properties: {
                    factorValue: renderFormItemSchema({
                      validateTitle: '因子数值',
                      required: false,
                      'x-component': 'NumberPicker',
                      'x-validator': [...RegNumberThree],
                      'x-component-props': {
                        min: 0,
                        style: { with: '100%' },
                      },
                    }),
                  },
                },
                columns4: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: '因子单位',
                    width: 400,
                  },
                  properties: {
                    config: {
                      type: 'void',
                      'x-component': 'FormGrid',
                      properties: {
                        factorUnitZ: renderFormItemSchema({
                          validateTitle: '分子单位',
                          required: false,
                          'x-component': 'Select',
                          'x-component-props': {
                            placeholder: '分子单位',
                            allowClear: true,
                          },
                          'x-decorator-props': {
                            addonAfter: '/',
                          },
                        }),
                        factorUnitM: renderFormItemSchema({
                          validateTitle: '分母单位',
                          required: false,
                          'x-component': 'Cascader',
                          'x-component-props': {
                            placeholder: '分母单位',
                            displayRender: (label: string[]) => {
                              if (!label) return '';
                              return label.slice(-1);
                            },
                            showSearch: true,
                          },
                        }),
                      },
                    },
                  },
                },
                columns5: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: 'GWP',
                  },
                  properties: {
                    gwp: renderEmptySchema(
                      { type: 'string' },
                      {
                        showVal: (row: { gas: string }) => {
                          return (
                            `${(gwpObj && gwpObj[row?.gas]) || '-'}` || '-'
                          );
                        },
                      },
                    ),
                  },
                },
              },
            },
          }),
          supplierData: {
            type: 'object',
            'x-reactions': {
              dependencies: ['.factorWay'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0] === "3"}}',
                },
              },
            },
            properties: {
              productName: renderFormItemSchema({
                title: '采购产品',
                type: 'string',
                required: false,
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '采购产品',
                },
              }),
              factorValue: renderFormItemSchema({
                title: '单位产品排放量',
                type: 'number',
                required: false,
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '单位产品排放量',
                },
              }),
              factorUnit: {
                type: 'void',
                title: '单位',
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                properties: {
                  factorUnitZ: renderFormItemSchema({
                    validateTitle: '分子单位',
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: '分子单位',
                    },
                    'x-decorator-props': {
                      addonAfter: '/',
                    },
                  }),
                  factorUnitM: renderFormItemSchema({
                    validateTitle: '分母单位',
                    'x-component': 'Cascader',
                    'x-component-props': {
                      placeholder: '分母单位',
                    },
                  }),
                },
              },
            },
          },
        },
      },
    },
  );

export const factorBaseSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          unitConver: renderFormItemSchema({
            title: '单位换算比例（活动数据单位/排放因子分母单位）',
            type: 'string',
            'x-validator': RegNumberFive,
            'x-component': 'NumberPicker',
          }),
          factorType: renderFormItemSchema({
            title: '排放因子类别',
            type: 'string',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
          factorSource: renderFormItemSchema({
            title: '排放因子来源',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: InputTextLength100,
            },
          }),
          year: renderFormItemSchema({
            title: '发布年份',
            type: 'string',
            'x-component': 'Select',
          }),
        },
      },
    },
  );
