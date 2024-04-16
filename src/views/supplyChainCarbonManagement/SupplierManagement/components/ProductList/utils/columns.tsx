/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-24 09:53:05
 */
import type { ColumnsType } from 'antd/es/table';

import { Product } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<Product> => [
  {
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    title: '规格/型号',
    dataIndex: 'productModel',
  },
  {
    title: '核算单位',
    dataIndex: 'productUnit',
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
  },
];
