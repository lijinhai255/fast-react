/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-12 23:03:08
 */
import type { ColumnsType } from 'antd/es/table';

import { ApplyComputationResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<ApplyComputationResp> => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
  },
  {
    title: '核算年份',
    dataIndex: 'year',
  },
  {
    title: '数据请求类型',
    dataIndex: 'applyType_name',
    render: value => {
      return `企业碳${value}`;
    },
  },
  {
    title: '企业碳核算标准',
    dataIndex: 'standardTypeNames',
  },
  {
    title: '排放总量（tCO₂e）',
    dataIndex: 'total',
  },
  {
    title: '获取时间',
    dataIndex: 'submitTime',
  },
];
