/*
 * @description: 供应商列表表头
 */

import { TableRenderProps } from 'table-render/dist/src/types';

import { Tags } from '@/components/Tags';
import { Supplier } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): TableRenderProps<Supplier>['columns'] => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 320,
  },
  {
    title: '供应商编码',
    dataIndex: 'supplierCode',
    width: 128,
  },
  {
    title: '提交状态',
    dataIndex: 'feedbackFlag',
    width: 128,
    render: value => {
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={value ? 'green' : 'orange'}
          tagText={value ? '已提交' : '未提交'}
        />
      );
    },
  },
];
