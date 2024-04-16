/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-08 14:41:42
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
    title: '分类名称',
    dataIndex: 'dictLabel',
  },
  {
    title: '分类标识',
    dataIndex: 'dictValue',
  },
  {
    title: '排序',
    dataIndex: 'dictSort',
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
export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    dictLabel: xRenderSeachSchema({
      type: 'string',
      placeholder: '请输入分类名称',
    }),
    dictValue: xRenderSeachSchema({
      type: 'string',
      placeholder: '请输入分类标识',
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
            title: '分类名称',
            'x-validator': [{ required: true, message: '请输入分类名称' }],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 100,
            },
          },
          dictValue: {
            type: 'string',
            title: '分类标识',
            'x-validator': [{ required: true, message: '请输入分类标识' }],
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
        },
      },
    },
  };
};
