import { Select } from '@formily/antd';
import { DefaultOptionType } from 'antd/lib/select';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
  switchComponents,
} from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';
import { RegNumberThree } from '@/views/eca/util/type';

import style from '../index.module.less';

export const baseScheme = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          name: renderFormItemSchema({
            title: '因子名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          firstClassify: renderFormItemSchema({
            title: '一级分类',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              filterOption: (input: string, option: any) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            },
          }),
          secondClassify: renderFormItemSchema({
            title: '二级分类',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              filterOption: (input: string, option: any) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            },
          }),
          sourceLanguage: renderFormItemSchema({
            // 源语言。字典值 1中文 2英语 3法语 4德语
            title: '源语言',
            required: false,
            'x-component': 'Select',
          }),
          sourceLanguageName: renderFormItemSchema({
            title: '名称（源语言）',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          empty: renderEmptySchema(),
          productName: renderFormItemSchema({
            title: '产品名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          emptyOne: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          productInfo: renderFormItemSchema({
            title: '产品信息',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Input.TextArea',
            'x-component-props': {
              maxLength: 500,
            },
          }),
          emptyTwo: renderEmptySchema(),
          systemBoundary: renderFormItemSchema({
            title: '系统边界',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Input.TextArea',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          emptyThree: renderEmptySchema(),
          description: renderFormItemSchema({
            title: '适用场景',
            'x-component': 'Input.TextArea',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              maxLength: 500,
            },
          }),
        },
      },
    },
  );

export const sourceSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          institution: renderFormItemSchema({
            title: '发布机构',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          year: renderFormItemSchema({
            title: '发布年份',
            'x-component': 'Select',
          }),
          area: {
            type: 'void',
            title: '地理代表性',
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
              areaRepresent: renderFormItemSchema({
                validateTitle: '地理代表性',
                type: 'number',
                'x-component': 'Select',
                'x-component-props': {
                  showSearch: true,
                  optionFilterProp: 'label',
                  allowClear: true,
                },
              }),
              areaRepresentDetail: renderFormItemSchema({
                validateTitle: '详情地址',
                required: false,
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
            },
          },
          sourceLevel: renderFormItemSchema({
            // 来源类别-字典
            title: '来源类别',
            'x-component': 'Select',
          }),
          techRepresent: renderFormItemSchema({
            title: '技术代表性',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          source: renderFormItemSchema({
            title: '来源文件',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 200,
            },
          }),
          url: renderFormItemSchema({
            title: '网址链接',
            required: false,
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              maxLength: 500,
            },
          }),
        },
      },
    },
  );
export enum HasSubCategoryGas {
  'HFCs' = 'HFCs',
  'PFCs' = 'PFCs',
}
export type TableSchemaProps = Record<HasSubCategoryGas, DefaultOptionType[]>;

export const tableSchema = (pageTypeInfo?: PageTypeInfo) =>
  renderSchemaWithLayout(
    {},
    {
      gasList: {
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
                            {window.location.pathname.indexOf('show') ===
                              -1 && (
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
              'x-component-props': { title: '因子单位', width: 400 },
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
                      'x-component':
                        pageTypeInfo === PageTypeInfo.show
                          ? 'Input'
                          : 'Cascader',
                      'x-component-props': {
                        placeholder: '分母单位',
                        displayRender: (label: string[]) => {
                          if (!label) return '';
                          return label.slice(-1);
                        },
                        showSearch: (
                          inputValue: string,
                          path: DefaultOptionType[],
                        ) =>
                          path.some(
                            option =>
                              (option.label as string)
                                .toLowerCase()
                                .indexOf(inputValue.toLowerCase()) > -1,
                          ),
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
  );
