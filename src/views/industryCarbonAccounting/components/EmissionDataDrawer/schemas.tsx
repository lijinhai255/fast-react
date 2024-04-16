import { SchemaProperties } from '@formily/react';

import {
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { SysBusinessColumnName } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { DATA_SETTING_TYPE, FILED_TYPE } from './constant';
import { checkValue } from '../../utils';

/** 获取非参数类型的schemas格式（生产单元、物料类型） */
export const onGetNoParamSchema = (filedType: number, cellId?: number) => {
  const schemaProperties = {
    /** 生产单元 */
    [FILED_TYPE.PRODUCT_CELL]: {
      required: true,
      'x-component': 'Select',
      'x-reactions': [`{{useProductCellDataSource('${cellId}')}}`],
    },
    /** 物料类型 */
    [FILED_TYPE.MATERIAL]: {
      'x-component': 'Radio.Group',
      enum: [
        {
          label: '碳输入',
          value: '0',
        },
        {
          label: '碳输出',
          value: '1',
        },
      ],
      default: '0',
    },
  };
  return schemaProperties[filedType as keyof typeof schemaProperties];
};

/** 获取主体参数类型的schemas格式 */
export const onGetMainParamSchema = (
  item: SysBusinessColumnName,
  onSearch: (value: string) => void,
  onBlur: () => void,
  onInputKeyDown: () => void,
) => {
  const { required, fixedParameter, dataSetting, dictType, dictSetting } =
    item || {};
  const schemaProperties = {
    /** 固定值 */
    [DATA_SETTING_TYPE.FIXED_VALUE]: {
      required: !required,
      'x-disabled': true,
      'x-component': 'Input',
      'x-value': fixedParameter,
    },
    /** 枚举值 */
    [DATA_SETTING_TYPE.ENUM_VALUE]: {
      required: !required,
      'x-component': 'FormilySearchInsertSelect',
      'x-component-props': {
        showSearch: !dictSetting,
        optionFilterProp: 'label',
        onSearch,
        onBlur,
        onInputKeyDown,
      },
      'x-reactions': [`{{useDictEnumOption('${dictType}')}}`],
    },
  };
  return schemaProperties[
    dataSetting as unknown as keyof typeof schemaProperties
  ];
};

/** 获取实体参数-数值类型schemas格式 */
export const onGetEntityParamNumberTypeSchema = (
  item: SysBusinessColumnName,
) => {
  const {
    id,
    required,
    fixedParameter,
    dataSetting,
    maxValue,
    minValue,
    digits = 0,
    name = '',
  } = item || {};

  const schemaProperties = {
    /** 固定值 */
    [DATA_SETTING_TYPE.FIXED_VALUE]: {
      required: !required,
      'x-disabled': true,
      'x-component': 'Input',
      'x-value': fixedParameter,
    },
    /** 录入值 */
    [DATA_SETTING_TYPE.INPUT_VALUE]: {
      required: !required,
      'x-component': 'Input',
      'x-component-props': {
        type: 'number',
        className: 'inputNumberWrapper',
      },
      'x-validator': (value: number) =>
        checkValue(value, Number(maxValue), Number(minValue), digits, name),
      'x-reactions': required
        ? {
            target: `${id}`,
            when: '{{!!$self.value}}',
            fulfill: {
              state: {
                required: true,
                validator: (value: number) =>
                  checkValue(
                    value,
                    Number(maxValue),
                    Number(minValue),
                    digits,
                    name,
                  ),
              },
            },
            otherwise: {
              state: {
                required: !required,
              },
            },
          }
        : undefined,
    },
  };
  return schemaProperties[
    dataSetting as unknown as keyof typeof schemaProperties
  ];
};

/** 获取实体参数-文本类型schemas格式 */
export const onGetEntityParamTextTypeSchema = (
  item: SysBusinessColumnName,
  onSearch: (value: string) => void,
  onBlur: () => void,
  onInputKeyDown: () => void,
) => {
  const {
    required,
    fixedParameter,
    dataSetting,
    digits,
    dictType,
    dictSetting,
  } = item || {};
  const schemaProperties = {
    /** 固定值 */
    [DATA_SETTING_TYPE.FIXED_VALUE]: {
      required: !required,
      'x-disabled': true,
      'x-component': 'Input',
      'x-value': fixedParameter,
    },
    /** 录入值 */
    [DATA_SETTING_TYPE.INPUT_VALUE]: {
      required: !required,
      'x-component': 'Input',
      'x-component-props': {
        maxLength: digits,
      },
    },
    /** 枚举值 */
    [DATA_SETTING_TYPE.ENUM_VALUE]: {
      required: !required,
      'x-component': 'FormilySearchInsertSelect',
      'x-component-props': {
        showSearch: !dictSetting,
        optionFilterProp: 'label',
        onSearch,
        onBlur,
        onInputKeyDown,
      },
      'x-reactions': [`{{useDictEnumOption('${dictType}')}}`],
    },
  };
  return schemaProperties[
    dataSetting as unknown as keyof typeof schemaProperties
  ];
};

/** 获取实体参数-文件类型schemas格式 */
export const onGetEntityParamFileTypeSchema = (item: SysBusinessColumnName) => {
  const { required } = item || {};
  const schemaProperties = {
    required: !required,
    type: 'array',
    'x-component': 'FormilyFileUpload',
  };
  return schemaProperties;
};

/** 基本信息 */
export const infoSchema = ({
  schemaData,
}: {
  schemaData: SchemaProperties<any, any, any, any, any, any, any, any>;
}) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 1,
        }),
        properties: {
          ...schemaData,
        },
      },
    },
  );
