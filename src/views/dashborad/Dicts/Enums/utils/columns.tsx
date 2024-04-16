/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-22 17:06:27
 */

import { ISchema } from '@formily/react';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { Button } from '@/components/Form/Button';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { DictDataResp } from '@/sdks/systemV2ApiDocs';

export const dictColumns = ({
  onEdit,
}: {
  onEdit: (row: DictDataResp) => Promise<any>;
}): TableRenderProps<DictDataResp>['columns'] => [
  {
    title: '枚举值名称',
    dataIndex: 'dictLabel',
  },
  {
    title: '枚举值标识',
    dataIndex: 'dictValue',
  },
  {
    title: '关联值',
    dataIndex: 'relatedValue',
  },
  {
    title: '排序',
    dataIndex: 'dictSort',
  },
  {
    title: '所属分类',
    dataIndex: 'sourceTypeName',
  },
  {
    title: '操作',
    dataIndex: 'id',
    render(val, row) {
      return (
        <Button
          type='link'
          onClick={async () => {
            onEdit(row);
          }}
        >
          编辑
        </Button>
      );
    },
  },
];

/** 数据字典搜索 schema  */
export const dictSearchSchema = ({
  dictSourceType,
}: {
  dictSourceType: DictDataResp[];
}): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    dictLabel: xRenderSeachSchema({
      type: 'string',
      placeholder: '请输入枚举值',
    }),
    dictValue: xRenderSeachSchema({
      type: 'string',
      placeholder: '请输入枚举值标识',
    }),
    sourceType: xRenderSeachSchema({
      type: 'string',
      placeholder: '请选择所属分类',
      enum: dictSourceType.map(d => d.dictValue as string),
      enumNames: dictSourceType.map(d => d.dictLabel as string),
      widget: 'select',
      props: {
        allowClear: true,
      },
    }),
  },
});

/** 数据字典 schema  */
export const dictAddSchema = (): ISchema => {
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
          dictLabel: {
            type: 'string',
            title: '枚举值名称',
            'x-validator': [{ required: true, message: '请输入枚举值名称' }],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 100,
            },
          },
          dictValue: {
            type: 'string',
            title: '枚举值标识',
            'x-validator': [{ required: true, message: '请输入枚举值标识' }],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 50,
            },
          },
          dictSort: {
            type: 'number',
            title: '排序',
            'x-validator': [{ required: true, message: '请输入排序' }],
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: '请输入',
              min: 0,
              max: 99999,
              step: 1,
              precision: 0,
            },
          },
          relatedValue: {
            type: 'string',
            title: '关联值',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 100,
            },
          },
          sourceType: {
            type: 'string',
            title: '所属分类',
            'x-validator': [{ required: true, message: '请输入所属分类' }],
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: '请选择',
            },
          },
        },
      },
    },
  };
};
