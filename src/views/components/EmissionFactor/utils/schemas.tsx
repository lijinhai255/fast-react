import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import {
  RegAccountValue,
  RegAccountUnitValue,
  RegFactorValue,
} from '@/views/carbonFootPrint/AccountsManagement/utils';

/** 基本信息schema */
export const basicSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          'x-component-props': {
            maxColumns: 3,
            minColumns: 1,
            columnGap: 35,
          },
        }),
        properties: {
          materialsType: renderFormItemSchema({
            title: '类型',
            type: 'string',
            'x-component': 'Select',
          }),
          materialsTypeFormula: renderFormItemSchema({
            title: '计算方式',
            type: 'number',
            'x-component': 'Radio.Group',
            enum: [
              { label: '按里程-产品重量', value: 1 },
              { label: '按里程-载重比', value: 2 },
              { label: '按能耗', value: 3 },
            ],
            default: 1,
            'x-reactions': [
              {
                dependencies: ['materialsType'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] === "运输"}}',
                  },
                },
              },
            ],
          }),
          materialName: renderFormItemSchema({
            title: '名称',
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          quantity: {
            type: 'void',
            title: '数量',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
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
              {
                dependencies: ['materialsTypeFormula'],
                fulfill: {
                  schema: {
                    'x-visible': '{{![1, 2].includes($deps[0])}}',
                  },
                },
              },
            ],

            properties: {
              weight: renderFormItemSchema({
                validateTitle: '数量',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-validator': (value: number) => RegAccountValue(value),
              }),
              maMeasure: renderFormItemSchema({
                validateTitle: '单位',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: '请选择单位',
                  showSearch: true,
                },
              }),
            },
          },
          productWeight: {
            type: 'void',
            title: '产品重量',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
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
              {
                dependencies: ['materialsTypeFormula'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] === 1}}',
                  },
                },
              },
            ],
            properties: {
              weight2: renderFormItemSchema({
                validateTitle: '数量',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-validator': (value: number) => RegAccountValue(value),
              }),
              maMeasure2: renderFormItemSchema({
                validateTitle: '数量单位',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择单位',
                },
                enum: [
                  { label: 't', value: 't' },
                  { label: 'kg', value: 'kg' },
                  { label: 'g', value: 'g' },
                ],
              }),
            },
          },
          weight3: renderFormItemSchema({
            title: '载重比例(%)',
            type: 'number',
            'x-component': 'Input',
            'x-validator': (value: number) => RegAccountValue(value),
            'x-reactions': {
              dependencies: ['materialsTypeFormula'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0] === 2}}',
                },
              },
            },
          }),
          distance: renderFormItemSchema({
            title: '运输里程（公里）',
            type: 'number',
            'x-component': 'Input',
            'x-validator': (value: number) => RegAccountValue(value),
            'x-reactions': {
              dependencies: ['materialsTypeFormula'],
              fulfill: {
                schema: {
                  'x-visible': '{{[1, 2].includes($deps[0])}}',
                },
              },
            },
          }),
        },
      },
    },
  );

/** 排放数据选择schema */
export const emissionTypeSchema = (isDetail: boolean) => ({
  type: 'void',
  properties: {
    factorType: {
      type: 'number',
      enum: [
        {
          value: 0,
          label: '排放因子',
        },
        {
          value: 1,
          label: '新建因子',
        },
        {
          value: 2,
          label: '供应商数据',
        },
      ],
      default: 0,
      'x-reactions': {
        target:
          'factorInfoObj.*(factorName,factorValue,factorUnit,factorSource,factorYear)',
        when: '{{ $self.value !== 1}}',
        fulfill: {
          state: {
            disabled: true,
            required: false,
          },
        },
        otherwise: {
          state: {
            disabled: !!isDetail,
            required: true,
          },
        },
      },
      'x-component': 'SelectButton',
    },
  },
});

/** 排放数据schema （自建因子\新建因子\供应商数据） */
export const emissionDataSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          'x-component-props': {
            maxColumns: 3,
            minColumns: 1,
          },
        }),
        properties: {
          factorInfoObj: {
            type: 'object',
            properties: {
              factorName: renderFormItemSchema({
                title: '排放因子名称',
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
              factorValue: renderFormItemSchema({
                title: '排放因子数值',
                type: 'number',
                'x-component': 'Input',
                'x-validator': (value: number) => RegFactorValue(value),
              }),
              factorUnit: {
                type: 'void',
                title: '排放因子单位',
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                'x-reactions': [
                  {
                    dependencies: ['factorType'],
                    fulfill: {
                      schema: {
                        'x-decorator-props': {
                          asterisk:
                            '{{$deps[0] === 1}}' || `{{!$form.readPretty}}`,
                        },
                      },
                    },
                  },
                ],
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
                      showSearch: true,
                    },
                  }),
                },
              },
              percentMeasure: renderFormItemSchema({
                title: '单位换算比例（数量单位/排放因子分母单位）',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-validator': (value: number) => RegAccountUnitValue(value),
              }),
              factorSource: renderFormItemSchema({
                title: '排放因子来源',
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
              factorYear: renderFormItemSchema({
                title: '发布年份',
                'x-component': 'Select',
              }),
            },
          },
        },
      },
    },
  );
