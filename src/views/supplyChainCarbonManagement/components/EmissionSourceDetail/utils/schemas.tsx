/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 18:39:13
 */
import { Select } from '@formily/antd';
import { ISchema } from '@formily/react';
import { TreeProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import {
  renderFormItemSchema,
  renderEmptySchema,
  switchComponents,
} from '@/components/formily/utils';
import { HasSubCategoryGas } from '@/views/Factors/Info/utils/schemas';
import { publishYear } from '@/views/Factors/utils';
import {
  InputTextLength100,
  InputTextLength20,
  InputTextLength50,
  RegNumAndLetters,
  RegNumberFive,
  RegNumberThree,
} from '@/views/eca/util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const baseSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              sourceName: {
                type: 'string',
                title: '排放源名称',
                'x-validator': [
                  { required: true, message: '请输入排放源名称' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              },
              sourceCode: {
                type: 'string',
                title: '排放源ID',
                'x-validator': [
                  { required: true, message: '请输入排放源ID' },
                  RegNumAndLetters,
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength20,
                },
              },
              facility: {
                type: 'string',
                title: '排放设施/活动',
                'x-validator': [
                  { required: true, message: '请输入排放设施/活动' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength100,
                },
              },
              ghgCategory: {
                type: 'string',
                title: 'GHG分类',
                'x-validator': [{ required: true, message: '请选择GHG分类' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请输入',
                },
              },
              ghgClassify: {
                type: 'string',
                title: 'GHG类别',
                'x-validator': [{ required: true, message: '请选择GHG类别' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component-props': {
                  placeholder: '请选择',
                  style: {
                    width: '50%',
                  },
                },
              },
              isoCategory: {
                type: 'string',
                title: 'ISO分类',
                'x-validator': [{ required: true, message: '请选择ISO分类' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                },
              },
              isoClassify: {
                type: 'string',
                title: 'ISO类别',
                'x-validator': [{ required: true, message: '请选择ISO类别' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                },
              },
            },
          },
        },
      },
    },
  };
};
export const activityFormSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              dataValue: {
                type: 'string',
                title: '活动数据',
                'x-validator': [
                  { required: true, message: '请输入活动数据单位' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              activityUnit: {
                type: 'string',
                title: '活动数据单位',
                'x-validator': [
                  { required: true, message: '请选择活动数据单位' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: '请选择',
                  displayRender: (label: string[]) => {
                    if (!label) return '';
                    return label.slice(-1);
                  },
                  showSearch: (inputValue: string, path: DefaultOptionType[]) =>
                    path.some(
                      option =>
                        (option.label as string)
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) > -1,
                    ),
                },
              },
              activityRecordWay: {
                type: 'string',
                title: '活动数据记录方式',
                'x-validator': [
                  { required: true, message: '请输入活动数据记录方式' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              },
              activityDept: {
                type: 'string',
                title: '活动数据保存部门',
                'x-validator': [
                  { required: true, message: '请输入活动数据保存部门' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              },
              activityCategory: {
                type: 'string',
                title: '活动数据类别',
                'x-validator': [
                  { required: true, message: '请选择活动数据类别' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择 ',
                },
              },
              activityScore: {
                type: 'string',
                title: '活动数据评分',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '活动数据评分',
                  disabled: true,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const factorSchema = (
  // isPageDetail: boolean,
  gwpObj?: { [key: string | number]: number },
): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              factorWay: {
                type: 'string',
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
                'x-decorator': 'FormItem',
                'x-component': 'SelectButton',
                'x-decorator-props': {
                  gridSpan: 3,
                },
                'x-reactions': {
                  target:
                    '*(gasList,supplierData,factorScore,factorScore,year,factorSource)',
                  when: `{{$self.value !== '2'}}`,
                  fulfill: {
                    state: {
                      disabled: true,
                      required: false,
                    },
                  },
                  otherwise: {
                    state: {
                      disabled: true,
                      required: true,
                    },
                  },
                },
              },
              gasList: {
                title: '排放因子（以下温室气体类型必填其一）',
                type: 'array',
                'x-component': 'ArrayTable',
                'x-decorator-props': {
                  gridSpan: 3,
                },
                'x-decorator': 'FormItem',
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
                        onCell: (row: any) => {
                          return {
                            colSpan: row?.gasType?.includes('CO₂e') ? 2 : 1,
                          };
                        },
                      },
                      properties: {
                        gasType: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => {
                              if (row?.gasType === '二氧化碳当量（CO₂e）') {
                                return (
                                  <>
                                    {window.location.pathname.indexOf(
                                      'show',
                                    ) === -1 && (
                                      <span className='ant-formily-item-asterisk'>
                                        *
                                      </span>
                                    )}
                                    {row?.gasType}
                                  </>
                                );
                              }
                              return row?.gasType;
                            },
                          },
                        ),
                      },
                    },
                    columns2: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: '温室气体',
                        onCell: (row: any) => {
                          return {
                            colSpan: row?.gasType?.includes('CO₂e') ? 0 : 1,
                          };
                        },
                        disabled: true,
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
                                  row?.gasType?.includes?.(g),
                                )
                              ) {
                                return (
                                  <Select
                                    {...props}
                                    placeholder='请选择'
                                    options={props.dataSource}
                                  />
                                );
                              }
                              // @ts-ignore
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
                          'x-component': 'NumberPicker',
                          'x-validator': [...RegNumberThree],

                          'x-component-props': {
                            min: 0,
                            style: { with: '100%' },
                          },
                          'x-reactions': [
                            {
                              when: `{{ $self.form.getValuesIn($self.path.toString().replace('factorValue', 'gasType')).includes('CO₂e')}}`,
                              otherwise: {
                                state: {
                                  required: false,
                                },
                              },
                            },
                          ],
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
                              'x-component': 'Select',
                              'x-component-props': {
                                placeholder: '分子单位',
                              },
                              'x-decorator-props': {
                                addonAfter: '/',
                              },
                              'x-reactions': [
                                {
                                  when: `{{ $self.form.getValuesIn($self.path.toString().replace('factorUnitZ', 'gasType')).includes('CO₂e')}}`,
                                  otherwise: {
                                    state: {
                                      required: false,
                                    },
                                  },
                                },
                              ],
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
                    columns5: {
                      type: 'void',
                      'x-component': 'ArrayTable.Column',
                      'x-component-props': {
                        title: 'GWP',
                        visible: false,
                        hidden: true,
                      },
                      properties: {
                        gwp: renderEmptySchema(
                          { type: 'string' },
                          {
                            showVal: row => {
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
              },
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
      },
    },
  };
};
export const factorBaseSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              unitConver: {
                type: 'string',
                title: '单位换算比例（活动数据单位/排放因子分母单位）',
                'x-validator': [
                  { required: true, message: '请输入单位换算比例' },
                  ...RegNumberFive,
                ],
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '单位换算比例',
                },
              },
              factorType: {
                type: 'string',
                title: '排放因子类别',
                'x-validator': [
                  { required: true, message: '请选择排放因子类别' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                },
              },
              factorScore: {
                type: 'string',
                title: '排放因子评分',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '排放因子评分',
                  disabled: true,
                },
              },
              GWP: {
                type: 'void',
                title: 'GWP版本',
                'x-decorator': 'FormItem',
                'x-component': 'CousInputText',
                'x-component-props': {
                  placeholder: 'GWP版本',
                  disabled: true,
                  initialValue:
                    'IPCC第六次评估报告（IPCC WGI Sixth Assessment Report.IPCC.2021）',
                },
                'x-reactions': {
                  dependencies: ['.factorWay'],
                  fulfill: {
                    schema: {
                      'x-visible': '{{$deps[0] !== "3"}}',
                    },
                  },
                },
              },
              factorSource: {
                type: 'string',
                title: '排放因子来源',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength100,
                },
              },
              year: {
                type: 'string',
                title: '发布年份',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: publishYear(),
                'x-component-props': {
                  placeholder: '请选择',
                  picker: 'year',
                },
              },
            },
          },
        },
      },
    },
  };
};
