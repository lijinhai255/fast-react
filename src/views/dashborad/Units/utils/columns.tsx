/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-27 14:17:54
 */

import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { LibUnitConversion } from '@/sdks/systemV2ApiDocs';

import { DictMap } from '../../Dicts/hooks';

export const columns = (
  units: DictMap,
  onDel: (row: LibUnitConversion) => void,
  onEdit: (row: LibUnitConversion) => void,
): TableRenderProps<LibUnitConversion>['columns'] => {
  const enumMap = units.enums.reduce((pre, next) => {
    if (next.dictValue) return { ...pre, [next.dictValue]: next.dictLabel };
    return pre;
  }, {} as Record<any, any>);
  const typeMap = units.type.reduce((pre, next) => {
    if (next.dictValue) return { ...pre, [next.dictValue]: next.dictLabel };
    return pre;
  }, {} as Record<any, any>);
  return [
    {
      title: '单位1',
      dataIndex: 'unitFromName',
      // copyable: true,
      enum: enumMap,
    },
    {
      title: '单位2',
      dataIndex: 'unitToName',
      enum: enumMap,
    },
    {
      title: '单位类型',
      dataIndex: 'unitClassName',
      enum: typeMap,
    },
    {
      title: '单位1/单位2',
      dataIndex: 'unitValue',
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'id',
      render(id, row) {
        return (
          <TableActions
            menus={compact([
              checkAuth('/sys/units/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => onEdit(row),
              }),
              checkAuth('/sys/units/del', {
                key: '删除',
                label: '删除',
                onClick: async () => {
                  return onDel(row);
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
