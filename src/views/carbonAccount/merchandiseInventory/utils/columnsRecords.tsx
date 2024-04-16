/*
 * @@description: 表头、筛选项 - 记录
 */

import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

export const columns = (): TableRenderProps<any>['columns'] => [
  {
    title: '变更类型',
    dataIndex: 'changeType_name',
    fixed: 'left',
  },
  {
    title: '变更数量',
    dataIndex: 'changeCount',
  },
  {
    title: '剩余库存',
    dataIndex: 'amount',
  },
  {
    title: '单据号',
    dataIndex: 'orderNo',
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  return {};
};
