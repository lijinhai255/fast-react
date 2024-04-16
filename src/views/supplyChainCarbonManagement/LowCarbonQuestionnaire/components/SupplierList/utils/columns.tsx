/*
 * @description: 供应商列表表头
 */

import { TableRenderProps } from 'table-render/dist/src/types';

import { Supplier } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): TableRenderProps<Supplier>['columns'] => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
  },
  {
    title: '供应商编码',
    dataIndex: 'supplierCode',
    width: 300,
  },
];
