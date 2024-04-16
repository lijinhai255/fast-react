/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 10:52:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-30 18:45:02
 */
import { TableRenderProps } from 'table-render/dist/src/types';

import { Supplier } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): TableRenderProps<
  Supplier & { supplierStatus_name: string }
>['columns'] => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    ellipsis: true,
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '联系人姓名',
    dataIndex: 'contactName',
  },
  {
    title: '联系人手机',
    dataIndex: 'contactMobile',
  },
  {
    title: '联系人邮箱',
    dataIndex: 'contactEmail',
  },
  {
    title: '供应商编码',
    dataIndex: 'supplierCode',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];
