/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-30 19:35:27
 */
import type { ColumnsType } from 'antd/es/table';

import { Supplier } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<Supplier> => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
  },
  {
    title: '联系人',
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
    title: '单位产品排放量（kgCO₂e/核算单位）',
    dataIndex: 'unitDischarge',
  },
  {
    title: '单价（元）',
    dataIndex: 'unitPrice',
  },

  {
    title: '最近申请产品碳足迹时间',
    dataIndex: 'lastApplyTime',
    width: 180,
  },
];
