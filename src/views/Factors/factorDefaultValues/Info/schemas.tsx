import { assign, chunk, compact } from 'lodash-es';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';
import { DefaultValueDto } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { DATASETTING } from './constant';
import { ColumnsType, HeadColType, ItemType } from './types';

/** input类型 */
export const inputSchema = (defaultValueList: DefaultValueDto) => {
  const { paramName, value, digits, maxValue, minValue } = defaultValueList;
  const id = `id${defaultValueList.id}`;

  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          [id]: renderFormItemSchema({
            title: paramName,
            'x-component': 'NumberPicker',
            'x-component-props': {
              stringMode: true,
              precision: digits,
              max: maxValue,
              min: minValue,
              formatter: (v: string | number) => `${v}`,
            },
            default: value || '',
            required: false,
          }),
        },
      },
    },
  );
};

/** table类型*/
export const tableSchema = (
  defaultValueList: DefaultValueDto,
  isDetail: boolean,
) => {
  const { paramName, fields, defaultValues } = defaultValueList;
  const id = `id${defaultValueList.id}`;

  /** 取值方式 */
  const { FIXED_VALUE, ENUMERATED_VALUE } = DATASETTING;

  /** 表头 */
  const getColumns = () => {
    const columns: ColumnsType = {
      properties: {},
    };
    fields?.forEach((item, index) => {
      const itemId = `${item.id}id`;
      /** 取值方式 0固定值,1录入值,2枚举值 */
      const { dataSetting } = item;

      if (index === 0) {
        columns.properties = {
          ...columns.properties,
          [itemId]: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: item.name,
              ellipsis: true,
            },
            properties: {
              [itemId]: renderEmptySchema(
                { type: 'string' },
                {
                  showVal: (row: HeadColType) => row[itemId],
                },
              ),
            },
          },
        };
      } else if (dataSetting === ENUMERATED_VALUE) {
        columns.properties = {
          ...columns.properties,
          [itemId]: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: item.name,
              ellipsis: true,
            },
            properties: {
              [itemId]: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-validator': [
                  { required: true, message: `请选择${item.name}` },
                ],
                'x-reactions': [`{{useAsyncDataSource('${item.dictType}')}}`],
                required: false,
              },
            },
          },
        };
      } else {
        const limitIndex = index - 1;
        /** 限制条件 */
        const limitAll = defaultValues ? defaultValues[0].defaultValueList : [];
        const numberLimit =
          limitAll && limitAll.length > 0
            ? {
                precision: limitAll[limitIndex].digits,
                max: limitAll[limitIndex].maxValue,
                min: limitAll[limitIndex].minValue,
              }
            : {};
        columns.properties = {
          ...columns.properties,
          [itemId]: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: item.name,
              ellipsis: true,
            },
            properties: {
              [itemId]: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-disabled': dataSetting === FIXED_VALUE || isDetail,
                'x-component-props': {
                  stringMode: true,
                  formatter: (v: string | number) => `${v}`,
                  ...numberLimit,
                },
                required: false,
              },
            },
          },
        };
      }
    });
    return columns;
  };

  /** 表头ID数组 */
  const fieldsIdArr = compact(fields?.map(field => `${field.id}id`));
  /** 表格数据 */
  const getItem = () => {
    const result: ItemType = [];
    /** 赋值反显 */
    defaultValues?.forEach(item => {
      /** 第一列 */
      result.push({
        [fieldsIdArr[0]]: item.dictLabel,
      });
      /** 其他列 */
      item.defaultValueList?.forEach((listItem, index) => {
        result.push({
          [fieldsIdArr[index + 1]]: listItem.value || '',
        });
      });
    });
    /** 处理结构 平分数组 */
    const num = fieldsIdArr.length;
    const newResult: ItemType[] = chunk(result, num);
    /** 处理结构 转换成一维 多个对象放到一个对象里 */
    const finalResult: ItemType = newResult.map(obj => assign({}, ...obj));
    return finalResult;
  };

  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          [id]: renderFormItemSchema({
            title: paramName,
            type: 'array',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component': 'ArrayTable',
            'x-component-props': {
              pagination: false,
              scroll: { x: '100%' },
            },
            items: {
              type: 'object',
              ...getColumns(),
            },
            default: getItem(),
            required: false,
          }),
        },
      },
    },
  );
};
