/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 10:14:58
 */

import { ISchema } from '@formily/react';
import { NavigateFunction } from 'react-router-dom';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { Button } from '@/components/Form/Button';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { RouteMaps, virtualLinkTransform } from '@/router/utils/enums';
import { DictTypeResp } from '@/sdks/systemV2ApiDocs';

export const dictColumns = ({
  navigate,
  onEdit,
}: {
  onEdit: (row: DictTypeResp) => Promise<any>;
  navigate: NavigateFunction;
}): TableRenderProps<DictTypeResp>['columns'] => [
  {
    title: '字典名称',
    dataIndex: 'dictName',
  },
  {
    title: '字典标识',
    dataIndex: 'dictType',
  },
  {
    title: '字典详情',
    dataIndex: 'dictType',
    render: (v: string) => {
      return (
        <>
          {checkAuth(
            '/sys/dictdata',
            <Button
              type='link'
              onClick={async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.systemDictCategory,
                    [':id'],
                    [v],
                  ),
                );
              }}
            >
              分类
            </Button>,
          )}
          {checkAuth(
            '/sys/dictenum',
            <Button
              type='link'
              onClick={async () => {
                navigate(
                  virtualLinkTransform(RouteMaps.systemDictInfo, [':id'], [v]),
                );
              }}
            >
              枚举值
            </Button>,
          )}
        </>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'id',
    render(val, row) {
      return checkAuth(
        '/sys/dicttype/edit',
        <Button
          type='link'
          onClick={async () => {
            onEdit(row);
          }}
        >
          编辑
        </Button>,
      );
    },
  },
];

/** 数据字典搜索 schema  */
export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    dictName: xRenderSeachSchema({
      type: 'string',
      placeholder: '字典名称',
    }),
    dictType: xRenderSeachSchema({
      type: 'string',
      placeholder: '字典标识',
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
          dictName: {
            type: 'string',
            title: '字典名称',
            'x-validator': [{ required: true, message: '请输入字典名称' }],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              maxLength: 100,
              placeholder: '请输入',
            },
          },
          dictType: {
            type: 'string',
            title: '字典标识',
            'x-validator': [{ required: true, message: '请输入字典标识' }],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 50,
            },
          },
        },
      },
    },
  };
};
