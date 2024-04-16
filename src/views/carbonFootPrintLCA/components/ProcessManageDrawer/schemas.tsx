import { isArray, omit } from 'lodash-es';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';
import { Dicts } from '@/views/dashborad/Dicts/hooks';

import {
  PRODUCTION_TYPE_OPTIONS,
  PRODUCTION_TYPE,
  INPUT_TYPE_OPTIONS,
  INPUT_TYPE,
  LIFE_CYCLE_OPTIONS,
  TRANSPORT_TYPE_OPTIONS,
  TRANSPORT_TYPE,
  OUTPUT_TYPE_OPTIONS,
  OUTPUT_TYPE,
  SELECT_BUTTON_OPTIONS,
  SELECT_BUTTON_TYPE,
} from './constant';
import style from './index.module.less';
import { ProcessManageFormProps } from './type';
import {
  LIFE_CYCLE_TYPE,
  PROCESS_CATATYPE,
} from '../ProcessManageTable/constant';
import { InputOutput, UploadFile } from '../ProcessManageTable/type';

/** 过程管理类型：产品、输入、输出 */
const { PRODUCTION, INPUT, OUTPUT } = PROCESS_CATATYPE;

/** 左侧菜单顶层的生命周期阶段 原材料、生产制造、分销储存、产品使用 */
const {
  RAW_MATERIAL,
  PRODUCTION_MANUFACTURING,
  DISTRIBUTION_STORAGE,
  PRODUCT_USE,
} = LIFE_CYCLE_TYPE;

/** 产品类型 副产品、避免产品*/
const { SIDE_PRODUCT, AVOID_PRODUCT } = PRODUCTION_TYPE;

/** 输入类型 运输、资本货物、处置产品 */
const { TRANSPORT, CAPITAL_GOODS, DISPOSAL_PRODUCTS } = INPUT_TYPE;
/** 输入-运输-计算方式 里程、能耗 */
const { MILEAGE, ENERGY } = TRANSPORT_TYPE;

/** 输出类型 可再生输出物 */
const { RENEWABLE_OUTPUTS } = OUTPUT_TYPE;

/** 上下游数据选择按钮 过程数据、因子数据 */
const { PROCESS_DATA, FACTOR_DATA } = SELECT_BUTTON_TYPE;

type SchemasProps = {
  /** 过程模型类别：1输入 2输出 3产品 */
  categoryType?: number;
  /** 生命周期阶段 */
  lifeStageType?: number;
  /** 是否展示过程模型的完整数据（包括产品、输入、输出） */
  showWholeProcess: boolean;
  /** 是否展示生命周期阶段选择按钮 */
  showLifeStageSelectRadio?: boolean;
};

/** 不同类型的上下游数据的展示信息 */
const onGetCategoryTypeUpOrDownstreamData = (categoryType?: number) => {
  const categoryTypeUpOrDownstreamData = {
    /** 产品 默认选择因子数据库 当产品类型为避免产品时 展示上下游数据 */
    [PRODUCTION]: {
      title: '上下游数据',
      default: FACTOR_DATA,
      dependencies: 'productType',
      visible: true,
      visibleValue: AVOID_PRODUCT,
    },
    /** 输入 默认展示过程数据 当输入类型为处置产品时不展示上游数据 */
    [INPUT]: {
      title: '上游数据',
      default: PROCESS_DATA,
      dependencies: 'inputOutputType',
      visible: false,
      visibleValue: DISPOSAL_PRODUCTS,
    },
    /** 输出 默认展示过程数据 当输出类型为可再生输出物时 不展示下游数据 */
    [OUTPUT]: {
      title: '下游数据',
      default: PROCESS_DATA,
      dependencies: 'inputOutputType',
      visible: false,
      visibleValue: RENEWABLE_OUTPUTS,
    },
  };
  return categoryTypeUpOrDownstreamData[
    categoryType as keyof typeof categoryTypeUpOrDownstreamData
  ];
};

/** 获取过程模型的schemas */
const onGetProcessManageScheams = ({
  categoryType,
  lifeStageType,
  showWholeProcess,
  showLifeStageSelectRadio,
}: SchemasProps) => {
  /** 过程管理的完整scheams */
  const processSchemasProperties = {
    /** 产品 */
    [PRODUCTION]: {
      productType: renderFormItemSchema({
        title: '类型',
        'x-component': 'Radio.Group',
        enum: PRODUCTION_TYPE_OPTIONS,
        default: SIDE_PRODUCT,
      }),
      name: renderFormItemSchema({
        title: '产品名称',
        'x-component': 'Input',
        'x-component-props': {
          maxLength: 100,
        },
      }),
      productCount: {
        type: 'void',
        title: '数量',
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
          count: renderFormItemSchema({
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
          unit: renderFormItemSchema({
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
      allocationCoefficient: renderFormItemSchema({
        title: '分配系数（%）',
        type: 'number',
        'x-component': 'NumberPicker',
        'x-component-props': {
          placeholder: '请输入',
          stringMode: true,
          formatter: (v: string | number) => `${v}`,
          precision: 2,
          min: 0.01,
          max: 100,
        },
        'x-reactions': {
          dependencies: ['productType'],
          fulfill: {
            schema: {
              'x-visible': `{{($deps[0] === ${SIDE_PRODUCT})}}`,
            },
          },
        },
      }),
      empty: renderEmptySchema({
        'x-reactions': {
          dependencies: ['productType'],
          fulfill: {
            schema: {
              'x-visible': `{{($deps[0] !== ${SIDE_PRODUCT})}}`,
            },
          },
        },
      }),
    },
    /** 输入 */
    [INPUT]: {
      inputOutputType: renderFormItemSchema({
        title: '类型',
        'x-component': 'Select',
        'x-component-props': {
          allowClear: true,
        },
        enum: INPUT_TYPE_OPTIONS,
      }),
      /** 当生命周期阶段为生产制造且为菜单顶级 才展示生命周期选择阶段，其下级则继承其生命周期阶段 */
      lifeStageType: renderFormItemSchema({
        title: '生命周期阶段',
        'x-visible': showLifeStageSelectRadio,
        'x-component': 'Radio.Group',
        enum: LIFE_CYCLE_OPTIONS,
        default: PRODUCTION_MANUFACTURING,
      }),
      name: renderFormItemSchema({
        title: '输入名称',
        'x-component': 'Input',
        'x-component-props': {
          maxLength: 100,
        },
      }),
      inputCount: {
        type: 'void',
        title: '数量',
        'x-decorator': 'FormItem',
        'x-component': 'FormGrid',
        'x-component-props': {
          className: style.gridWrapper,
        },
        'x-reactions': [
          {
            dependencies: ['inputOutputType'],
            fulfill: {
              schema: {
                'x-visible': `{{($deps[0] !== ${TRANSPORT})}}`,
                'x-decorator-props': {
                  asterisk: `{{!$form.readPretty}}`,
                },
              },
            },
          },
        ],
        properties: {
          count: renderFormItemSchema({
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
          unit: renderFormItemSchema({
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
      calcMethod: renderFormItemSchema({
        title: '计算方式',
        'x-component': 'Radio.Group',
        enum: TRANSPORT_TYPE_OPTIONS,
        default: MILEAGE,
        'x-reactions': {
          dependencies: ['inputOutputType'],
          fulfill: {
            schema: {
              'x-visible': `{{($deps[0] === ${TRANSPORT})}}`,
            },
          },
        },
      }),
      transportMileage: renderFormItemSchema({
        title: '运输里程(km)',
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
        'x-reactions': {
          dependencies: ['inputOutputType', 'calcMethod'],
          fulfill: {
            schema: {
              'x-visible': `{{($deps[0] === ${TRANSPORT} && $deps[1] === ${MILEAGE})}}`,
            },
          },
        },
      }),
      energyCountInfo: {
        type: 'void',
        title: '能耗数量',
        'x-decorator': 'FormItem',
        'x-component': 'FormGrid',
        'x-component-props': {
          className: style.gridWrapper,
        },
        'x-reactions': [
          {
            dependencies: ['inputOutputType', 'calcMethod'],
            fulfill: {
              schema: {
                'x-visible': `{{($deps[0] === ${TRANSPORT} && $deps[1] === ${ENERGY} )}}`,
                'x-decorator-props': {
                  asterisk: `{{!$form.readPretty}}`,
                },
              },
            },
          },
        ],
        properties: {
          energyCount: renderFormItemSchema({
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
          energyUnit: renderFormItemSchema({
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
      goodsName: renderFormItemSchema({
        title: '货物名称',
        'x-component': 'Input',
        'x-component-props': {
          maxLength: 100,
        },
        'x-reactions': {
          dependencies: ['inputOutputType'],
          fulfill: {
            schema: {
              'x-visible': `{{($deps[0] === ${TRANSPORT})}}`,
            },
          },
        },
      }),
      goodsWeight: {
        type: 'void',
        title: '货物重量',
        'x-decorator': 'FormItem',
        'x-component': 'FormGrid',
        'x-component-props': {
          className: style.gridWrapper,
        },
        'x-reactions': [
          {
            dependencies: ['inputOutputType', 'calcMethod'],
            fulfill: {
              schema: {
                'x-visible': `{{($deps[0] === ${TRANSPORT} && $deps[1] === ${MILEAGE} )}}`,
                'x-decorator-props': {
                  asterisk: `{{!$form.readPretty}}`,
                },
              },
            },
          },
        ],
        properties: {
          weightCount: renderFormItemSchema({
            validateTitle: '重量',
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
          weightUnit: renderFormItemSchema({
            validateTitle: '重量单位',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
        },
      },
      depreciationRate: renderFormItemSchema({
        title: '折旧率（%）',
        type: 'number',
        'x-component': 'NumberPicker',
        'x-component-props': {
          placeholder: '请输入',
          stringMode: true,
          formatter: (v: string | number) => `${v}`,
          precision: 2,
          min: 0.01,
          max: 100,
        },
        'x-reactions': {
          dependencies: ['inputOutputType'],
          fulfill: {
            schema: {
              'x-visible': `{{($deps[0] === ${CAPITAL_GOODS})}}`,
            },
          },
        },
      }),
      empty: renderEmptySchema({
        'x-reactions': {
          dependencies: ['inputOutputType', 'calcMethod'],
          fulfill: {
            schema: {
              'x-visible': showLifeStageSelectRadio
                ? `{{($deps[0] === ${CAPITAL_GOODS} || ($deps[0] === ${TRANSPORT} && $deps[1] === ${MILEAGE}))}}`
                : `{{(($deps[0] !== ${CAPITAL_GOODS} && $deps[0] !== ${TRANSPORT}) || ($deps[0] === ${TRANSPORT} && $deps[1] === ${ENERGY}))}}`,
            },
          },
        },
      }),
    },
    /** 输出 */
    [OUTPUT]: {
      inputOutputType: renderFormItemSchema({
        title: '类型',
        'x-component': 'Select',
        'x-component-props': {
          allowClear: true,
        },
        enum: OUTPUT_TYPE_OPTIONS,
      }),
      name: renderFormItemSchema({
        title: '输出名称',
        'x-component': 'Input',
        'x-component-props': {
          maxLength: 100,
        },
      }),
      outputCount: {
        type: 'void',
        title: '数量',
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
          count: renderFormItemSchema({
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
          unit: renderFormItemSchema({
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
      empty: renderEmptySchema(),
    },
  };

  /** 原材料生命周期阶段 */
  const materialSchemasProperties = {
    [INPUT]: {
      name: renderFormItemSchema({
        title: '原材料',
        'x-component': 'Input',
        'x-component-props': {
          maxLength: 100,
        },
      }),
      materialCount: {
        type: 'void',
        title: '数量',
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
          count: renderFormItemSchema({
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
          unit: renderFormItemSchema({
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
      inputOutputType: renderFormItemSchema({
        title: '类型',
        'x-component': 'Radio.Group',
        enum: INPUT_TYPE_OPTIONS.slice(0, 3),
        default: INPUT_TYPE.RAW_MATERIAL,
      }),
      empty: renderEmptySchema(),
    },
  };

  /** 分销储存生命周期阶段 */
  const storageSchemasProperties = {
    [INPUT]: {
      name: renderFormItemSchema({
        title: '分销场景',
        'x-component': 'Input',
        'x-component-props': {
          maxLength: 100,
        },
      }),
      storageCount: {
        type: 'void',
        title: '数量',
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
          count: renderFormItemSchema({
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
          unit: renderFormItemSchema({
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
    },
  };

  /** 产品使用生命周期阶段 */
  const productionUseSchemasProperties = {
    [INPUT]: {
      name: renderFormItemSchema({
        title: '使用场景',
        'x-component': 'Input',
        'x-component-props': {
          maxLength: 100,
        },
      }),
      useCount: {
        type: 'void',
        title: '数量',
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
          count: renderFormItemSchema({
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
          unit: renderFormItemSchema({
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
    },
  };

  /** 完整的过程展示的schemas */
  if (showWholeProcess) {
    return processSchemasProperties[
      categoryType as keyof typeof processSchemasProperties
    ];
  }

  /** 仅原材料、分销储存、产品使用顶层的菜单展示schemas */
  const lifeTypeSchemasProperties = {
    /** 原材料 */
    [RAW_MATERIAL]: materialSchemasProperties,
    /** 分销储存 */
    [DISTRIBUTION_STORAGE]: storageSchemasProperties,
    /** 产品使用 */
    [PRODUCT_USE]: productionUseSchemasProperties,
  };

  const categoryTypeProperties =
    lifeTypeSchemasProperties[
      lifeStageType as keyof typeof lifeTypeSchemasProperties
    ];
  return (
    categoryTypeProperties?.[
      categoryType as keyof typeof categoryTypeProperties
    ] || {}
  );
};

export const schema = ({
  categoryType,
  lifeStageType,
  showWholeProcess,
  showLifeStageSelectRadio,
}: SchemasProps) => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          ...onGetProcessManageScheams({
            categoryType,
            showWholeProcess,
            lifeStageType,
            showLifeStageSelectRadio,
          }),
        },
      },
    },
  );
};

/** 上下游数据 */
export const upOrDownstreamDataScheams = (categoryType?: number) => {
  const {
    title,
    default: defaultValue,
    dependencies,
    visible,
    visibleValue,
  } = onGetCategoryTypeUpOrDownstreamData(categoryType) || {};
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 2,
        }),
        properties: {
          dataType: renderFormItemSchema({
            title,
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              optionType: 'button',
              buttonStyle: 'solid',
            },
            enum: SELECT_BUTTON_OPTIONS,
            default: defaultValue,
            'x-reactions': [
              {
                dependencies: [dependencies],
                fulfill: {
                  schema: {
                    'x-visible': visible
                      ? `{{($deps[0] === ${visibleValue})}}`
                      : `{{($deps[0] !== ${visibleValue})}}`,
                  },
                },
              },
            ],
          }),
          upOrDownstreamData: {
            type: 'object',
            'x-reactions': {
              dependencies: [dependencies],
              fulfill: {
                schema: {
                  'x-visible': visible
                    ? `{{($deps[0] === ${visibleValue})}}`
                    : `{{($deps[0] !== ${visibleValue})}}`,
                },
              },
            },
            properties: {
              processName: renderFormItemSchema({
                title: '过程名称',
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
              relatedProductName: renderFormItemSchema({
                title: '产品名称',
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
              productCarbonFootPrint: {
                type: 'void',
                title: '产品碳足迹',
                'x-decorator': 'FormItem',
                'x-component': 'FormGrid',
                'x-component-props': {
                  className: style.gridWrapper,
                },
                'x-reactions': [
                  {
                    dependencies: ['dataType'],
                    fulfill: {
                      schema: {
                        'x-visible': `{{$deps[0] === ${FACTOR_DATA} }}`,
                        'x-decorator-props': {
                          asterisk: `{{!$form.readPretty}}`,
                        },
                      },
                    },
                  },
                ],
                properties: {
                  factorValue: renderFormItemSchema({
                    validateTitle: '数值',
                    required: false,
                    'x-component': 'NumberPicker',
                    'x-component-props': {
                      placeholder: '请输入',
                      stringMode: true,
                      formatter: (v: string | number) => `${v}`,
                      precision: 10,
                      min: 0.0000000001,
                      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                      max: 99999999999.9999999999,
                    },
                  }),
                  factorUnitZ: renderFormItemSchema({
                    validateTitle: '单位',
                    type: 'number',
                    'x-component': 'Select',
                    'x-component-props': {
                      allowClear: true,
                    },
                  }),
                },
              },
              relatedProductUnit: renderFormItemSchema({
                title: '产品单位',
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
              convertRatio: renderFormItemSchema({
                title: '单位换算比例（数量单位/产品单位）',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '请输入',
                  stringMode: true,
                  formatter: (v: string | number) => `${v}`,
                  precision: 10,
                  min: 0.0000000001,
                  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                  max: 99999999999.9999999999,
                },
              }),
              timeRepresent: renderFormItemSchema({
                title: '时间代表性',
                'x-component': 'Select',
                'x-component-props': {
                  allowClear: true,
                },
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
                          asterisk: '{{!$form.readPretty}}',
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
              techRepresent: renderFormItemSchema({
                title: '技术代表性',
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
              dataSource: renderFormItemSchema({
                title: '数据来源',
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 100,
                },
              }),
              empty: renderEmptySchema({
                'x-reactions': {
                  dependencies: ['dataType'],
                  fulfill: {
                    schema: {
                      'x-visible': `{{$deps[0] === ${FACTOR_DATA}}}`,
                    },
                  },
                },
              }),
            },
          },
          /** 选择的输入 */
          downStreamInputData: {
            type: 'object',
            'x-reactions': {
              dependencies: [dependencies],
              fulfill: {
                schema: {
                  'x-visible':
                    categoryType === OUTPUT
                      ? visible
                        ? `{{($deps[0] !== ${visibleValue})}}`
                        : `{{($deps[0] === ${visibleValue})}}`
                      : false,
                },
              },
            },
            properties: {
              processName: renderFormItemSchema({
                title: '过程名称',
                type: 'string',
                required: false,
                'x-disabled': true,
                'x-component': 'Input',
              }),
              relatedInputName: renderFormItemSchema({
                title: '输入名称',
                type: 'string',
                required: false,
                'x-disabled': true,
                'x-component': 'Input',
              }),
              relatedInputType: renderFormItemSchema({
                title: '输入类型',
                type: 'string',
                required: false,
                'x-disabled': true,
                'x-component': 'Select',
                'x-component-props': {
                  allowClear: true,
                },
                enum: INPUT_TYPE_OPTIONS,
              }),
              relatedInputUnit: renderFormItemSchema({
                title: '输入单位',
                type: 'string',
                required: false,
                'x-disabled': true,
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
              recycling: {
                type: 'void',
                title: '循环利用数量',
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
                  recyclingCount: renderFormItemSchema({
                    validateTitle: '数量',
                    type: 'number',
                    'x-component': 'NumberPicker',
                    'x-component-props': {
                      placeholder: '请输入',
                      min: 0,
                    },
                  }),
                  recyclingUnit: renderFormItemSchema({
                    validateTitle: '单位',
                    required: false,
                    'x-disabled': true,
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
              convertRatio: renderFormItemSchema({
                title: '单位换算比例（数量单位/输入单位）',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '请输入',
                  stringMode: true,
                  formatter: (v: string | number) => `${v}`,
                  precision: 10,
                  min: 0.0000000001,
                  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
                  max: 99999999999.9999999999,
                },
              }),
            },
          },
          supportMaterials: renderFormItemSchema({
            title: '支撑文件',
            required: false,
            type: 'array',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'FormilyFileUpload',
          }),
        },
      },
    },
  );
};

/** 新增、编辑时的数据处理 */
export const onHandleAddOrEditData = ({
  categoryType,
  lifeStageType,
  showWholeProcess,
  showLifeStageSelectRadio,
  objectType,
  processColumnId,
  formValues,
}: SchemasProps & {
  /** 支撑材料的模块类型 */
  objectType: number;
  /** 当前点击所在行的id */
  processColumnId?: number;
  /** 表单填写的数据 */
  formValues: ProcessManageFormProps;
}) => {
  /** 表单填写的数据 */
  const {
    name,
    count,
    unit,
    supportMaterials,
    /** 产品相关 */
    productType,
    allocationCoefficient,
    /** 输入相关 */
    inputOutputType,
    lifeStageType: formLifeStageType,
    calcMethod,
    transportMileage,
    goodsName,
    weightCount,
    weightUnit,
    energyCount,
    energyUnit,
    depreciationRate,
    /** 输出相关-选择输入 */
    downStreamInputData,
    /** 上下游数据相关 */
    dataType,
    upOrDownstreamData,
  } = formValues || {};

  /** 上下游数据的-过程数据、因子数据 */
  const {
    processName,
    relatedProductName,
    factorValue,
    factorUnitZ,
    relatedProductUnit,
    convertRatio,
    timeRepresent,
    areaRepresent,
    areaRepresentDetail,
    techRepresent,
    dataSource,
  } = upOrDownstreamData || {};

  /** 输出-可再生输出物-选择输入数据 */
  const {
    processName: inputProcessName,
    relatedInputName,
    relatedInputType,
    relatedInputUnit,
    recyclingCount,
    convertRatio: inputConvertRatio,
  } = downStreamInputData || {};

  /** 数量单位的处理 */
  const unitBack = unit ? (isArray(unit) ? String(unit) : unit) : '';
  /** 上下游数据关联的产品单位 */
  const relatedProductUnitBack = relatedProductUnit
    ? isArray(relatedProductUnit)
      ? String(relatedProductUnit)
      : relatedProductUnit
    : '';
  /** 输入-运输-按里程-货物重量单位 */
  const weightUnitBack = weightUnit;
  /** 输入-运输-按能耗-能耗数量单位 */
  const energyUnitBack = energyUnit
    ? isArray(energyUnit)
      ? String(energyUnit)
      : energyUnit
    : '';

  /** 输出-可再生输出物-输入单位 */
  const relatedInputUnitBack = relatedInputUnit
    ? isArray(relatedInputUnit)
      ? String(relatedInputUnit)
      : relatedInputUnit
    : '';

  /** 输入-运输- 数量和单位的值 */
  const transportMap = {
    /** 按里程 */
    [MILEAGE]: {
      count: weightCount,
      unit: weightUnitBack,
    },
    /** 按能耗 */
    [ENERGY]: {
      count: energyCount,
      unit: energyUnitBack,
    },
  };
  const transportInfo = transportMap[calcMethod as keyof typeof transportMap];

  /** 支撑材料的处理 */
  const supportMaterialsList = supportMaterials?.map(file => {
    const { name: fileName, uid, url } = file || {};
    return omit(
      {
        ...file,
        fileId: uid,
        fileName,
        fileUrl: url,
        objectId: processColumnId,
        objectType, // 模块类型: 1 过程; 2 输入/输出(1:过程; 2:输入/输出; 3:过程库; 4:输入/输出库),
      },
      ['name', 'uid', 'url'],
    );
  });

  /** 上下游数据 */
  const upOrDownstreamProcessManageData = {
    processName,
    relatedProductName,
    factorValue: dataType === FACTOR_DATA ? factorValue : undefined,
    factorUnitZ: dataType === FACTOR_DATA ? factorUnitZ : undefined,
    relatedProductUnit: relatedProductUnitBack,
    convertRatio,
    timeRepresent,
    areaRepresent,
    areaRepresentDetail,
    techRepresent,
    dataSource,
  };

  /** 下游选择的输入数据 */
  const downStreamInputProcessManageData = {
    processName: inputProcessName,
    relatedProductName: relatedInputName,
    relatedInputType,
    relatedProductUnit: relatedInputUnitBack,
    recyclingCount,
    convertRatio: inputConvertRatio,
  };

  /** 完整的过程管理的数据 （产品、输入、输出）*/
  const wholeProcessManageData = {
    /** 产品 */
    [PRODUCTION]: {
      lifeStageType,
      productType,
      name,
      count,
      unit: unitBack,
      allocationCoefficient:
        productType === SIDE_PRODUCT ? allocationCoefficient : '',
      dataType: productType === AVOID_PRODUCT ? dataType : undefined,
      ...upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsList,
    },
    /** 输入 */
    [INPUT]: {
      inputOutputType,
      lifeStageType: showLifeStageSelectRadio
        ? formLifeStageType
        : lifeStageType,
      name,
      count: inputOutputType === TRANSPORT ? transportInfo?.count : count,
      unit: inputOutputType === TRANSPORT ? transportInfo?.unit : unitBack,
      calcMethod: inputOutputType === TRANSPORT ? calcMethod : undefined,
      transportMileage:
        inputOutputType === TRANSPORT && calcMethod === MILEAGE
          ? transportMileage
          : undefined,
      goodsName: inputOutputType === TRANSPORT ? goodsName : '',
      depreciationRate:
        inputOutputType === CAPITAL_GOODS ? depreciationRate : undefined,
      dataType: inputOutputType === DISPOSAL_PRODUCTS ? undefined : dataType,
      ...upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsList,
    },
    [OUTPUT]: {
      lifeStageType,
      inputOutputType,
      name,
      count,
      unit: unitBack,
      dataType: inputOutputType === RENEWABLE_OUTPUTS ? undefined : dataType,
      ...upOrDownstreamProcessManageData,
      ...downStreamInputProcessManageData,
      /** 输入和过程以下字段一致，避免冲突，对以下字段重新赋值 */
      processName,
      relatedProductName,
      relatedProductUnit:
        inputOutputType === RENEWABLE_OUTPUTS
          ? relatedInputUnitBack
          : relatedProductUnitBack,
      convertRatio:
        inputOutputType === RENEWABLE_OUTPUTS
          ? inputConvertRatio
          : convertRatio,
      supportMaterials: supportMaterialsList,
    },
  };

  /** 原材料生命周期过程管理数据 */
  const materialProcessManageData = {
    [INPUT]: {
      lifeStageType,
      name,
      count,
      unit: unitBack,
      inputOutputType,
      dataType,
      ...upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsList,
    },
  };

  /** 分销和储存生命周期过程管理数据 */
  const storageProcessManageData = {
    [INPUT]: {
      lifeStageType,
      name,
      count,
      unit: unitBack,
      dataType,
      ...upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsList,
    },
  };

  /** 产品使用生命周期过程管理数据 */
  const productUseProcessManageData = {
    [INPUT]: {
      lifeStageType,
      name,
      count,
      unit: unitBack,
      dataType,
      ...upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsList,
    },
  };

  if (showWholeProcess) {
    return wholeProcessManageData[
      categoryType as keyof typeof wholeProcessManageData
    ];
  }
  const lifeCycleProcessManageDataMap = {
    /** 原材料 */
    [RAW_MATERIAL]: materialProcessManageData,
    /** 分销储存 */
    [DISTRIBUTION_STORAGE]: storageProcessManageData,
    /** 产品使用 */
    [PRODUCT_USE]: productUseProcessManageData,
  };
  const lifeCycleProcessManageData =
    lifeCycleProcessManageDataMap[
      lifeStageType as keyof typeof lifeCycleProcessManageDataMap
    ];

  return lifeCycleProcessManageData[
    categoryType as keyof typeof lifeCycleProcessManageData
  ];
};

/** 详情反显时的数据处理 */
export const onHandleDetailData = ({
  categoryType,
  lifeStageType,
  showWholeProcess,
  processManageDataSource,
  unitOptions,
  isDetail,
}: SchemasProps & {
  processManageDataSource: InputOutput;
  unitOptions?: Dicts[];
  isDetail: boolean;
}) => {
  const {
    name,
    count,
    unit,
    /** 产品相关 */
    productType,
    allocationCoefficient,
    /** 输入相关 */
    inputOutputType,
    lifeStageType: formLifeStageType,
    calcMethod,
    transportMileage,
    goodsName,
    depreciationRate,
    /** 输出部分-下游输入数据部分 */
    relatedInputType,
    recyclingCount,
    /** 上下游数据部分 */
    dataType,
    processName,
    relatedProductName,
    factorValue,
    factorUnitZ,
    relatedProductUnit,
    convertRatio,
    timeRepresent,
    areaRepresent,
    areaRepresentDetail,
    techRepresent,
    dataSource,
    /** 支撑材料 */
    supportMaterials,
  } = processManageDataSource || {};

  /** 获取单位名称 */
  const getUnitLabel = (dictValue: string) => {
    const unitEnumsItem = unitOptions?.find(
      item => item.dictValue === dictValue,
    );
    return unitEnumsItem?.dictLabel;
  };

  /** 数量单位处理 */
  const unitArr = unit ? unit.split(',') : undefined;

  const unitBack =
    isDetail && unit ? getUnitLabel((unitArr || [])?.[1]) : unitArr;

  /** 上下游数据关联的产品单位 */
  const relatedProductUnitArr = relatedProductUnit
    ? relatedProductUnit.split(',')
    : undefined;

  const relatedProductUnitBack =
    isDetail && relatedProductUnit
      ? getUnitLabel((relatedProductUnitArr || [])?.[1])
      : relatedProductUnitArr;

  const supportMaterialsFileList = supportMaterials?.map((file: UploadFile) => {
    const { fileName, fileId, fileUrl } = file || {};
    return {
      ...file,
      name: fileName,
      uid: fileId,
      url: fileUrl,
    };
  });

  /** 上下游数据 */
  const upOrDownstreamProcessManageData = {
    processName,
    relatedProductName,
    factorValue: dataType === FACTOR_DATA ? factorValue : undefined,
    factorUnitZ: dataType === FACTOR_DATA ? factorUnitZ : undefined,
    relatedProductUnit: relatedProductUnitBack,
    convertRatio: convertRatio ?? '',
    timeRepresent,
    areaRepresent,
    areaRepresentDetail,
    techRepresent,
    dataSource,
  };

  /** 下游选择的输入数据 */
  const downStreamInputProcessManageData = {
    processName,
    relatedInputName: relatedProductName,
    relatedInputType,
    relatedInputUnit: relatedProductUnitBack,
    recyclingCount,
    recyclingUnit: unitBack,
    convertRatio: convertRatio ?? '',
  };

  /** 完整的过程管理的数据 （产品、输入、输出）*/
  const wholeProcessManageData = {
    /** 产品 */
    [PRODUCTION]: {
      productType,
      name,
      count,
      unit: unitBack,
      allocationCoefficient:
        productType === SIDE_PRODUCT ? allocationCoefficient : '',
      dataType: productType === AVOID_PRODUCT ? dataType : undefined,
      upOrDownstreamData:
        productType === AVOID_PRODUCT
          ? upOrDownstreamProcessManageData
          : undefined,
      supportMaterials: supportMaterialsFileList,
    },
    /** 输入 */
    [INPUT]: {
      inputOutputType,
      lifeStageType: formLifeStageType,
      name,
      count: inputOutputType === TRANSPORT ? undefined : count,
      unit: inputOutputType === TRANSPORT ? undefined : unitBack,
      calcMethod: inputOutputType === TRANSPORT ? calcMethod : undefined,
      transportMileage:
        inputOutputType === TRANSPORT && calcMethod === MILEAGE
          ? transportMileage
          : undefined,
      goodsName: inputOutputType === TRANSPORT ? goodsName : '',
      weightCount:
        inputOutputType === TRANSPORT && calcMethod === MILEAGE
          ? count
          : undefined,
      weightUnit:
        inputOutputType === TRANSPORT && calcMethod === MILEAGE
          ? unit
          : undefined,
      energyCount:
        inputOutputType === TRANSPORT && calcMethod === ENERGY
          ? count
          : undefined,
      energyUnit:
        inputOutputType === TRANSPORT && calcMethod === ENERGY
          ? unitBack
          : undefined,
      depreciationRate:
        inputOutputType === CAPITAL_GOODS ? depreciationRate : undefined,
      dataType: inputOutputType === DISPOSAL_PRODUCTS ? undefined : dataType,
      upOrDownstreamData:
        inputOutputType === DISPOSAL_PRODUCTS
          ? undefined
          : upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsFileList,
    },
    [OUTPUT]: {
      inputOutputType,
      name,
      count,
      unit: unitBack,
      dataType: inputOutputType === RENEWABLE_OUTPUTS ? undefined : dataType,
      upOrDownstreamData:
        inputOutputType === RENEWABLE_OUTPUTS
          ? undefined
          : upOrDownstreamProcessManageData,
      downStreamInputData:
        inputOutputType === RENEWABLE_OUTPUTS
          ? downStreamInputProcessManageData
          : undefined,
      supportMaterials: supportMaterialsFileList,
    },
  };

  /** 原材料生命周期过程管理数据 */
  const materialProcessManageData = {
    [INPUT]: {
      name,
      count,
      unit: unitBack,
      inputOutputType,
      dataType,
      upOrDownstreamData: upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsFileList,
    },
  };

  /** 分销和储存生命周期过程管理数据 */
  const storageProcessManageData = {
    [INPUT]: {
      name,
      count,
      unit: unitBack,
      dataType,
      upOrDownstreamData: upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsFileList,
    },
  };

  /** 产品使用生命周期过程管理数据 */
  const productUseProcessManageData = {
    [INPUT]: {
      name,
      count,
      unit: unitBack,
      dataType,
      upOrDownstreamData: upOrDownstreamProcessManageData,
      supportMaterials: supportMaterialsFileList,
    },
  };

  if (showWholeProcess) {
    return wholeProcessManageData[
      categoryType as keyof typeof wholeProcessManageData
    ];
  }
  const lifeCycleProcessManageDataMap = {
    /** 原材料 */
    [RAW_MATERIAL]: materialProcessManageData,
    /** 分销储存 */
    [DISTRIBUTION_STORAGE]: storageProcessManageData,
    /** 产品使用 */
    [PRODUCT_USE]: productUseProcessManageData,
  };
  const lifeCycleProcessManageData =
    lifeCycleProcessManageDataMap[
      lifeStageType as keyof typeof lifeCycleProcessManageDataMap
    ];

  return lifeCycleProcessManageData[
    categoryType as keyof typeof lifeCycleProcessManageData
  ];
};
