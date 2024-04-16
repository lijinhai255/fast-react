/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-12 23:12:26
 */
import type { ColumnsType } from 'antd/es/table';

import { ApplyFootprintResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<ApplyFootprintResp> => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    title: '核算单位',
    dataIndex: 'productUnit',
  },
  {
    title: '系统边界',
    dataIndex: 'periodType_name',
  },
  {
    title: '数据请求类型',
    dataIndex: 'applyType_name',
    render: value => {
      return `产品碳足迹${value}`;
    },
  },
  {
    title: '单位产品排放量（tCO₂e）',
    dataIndex: 'dischargeRate',
  },
  {
    title: '核算周期',
    dataIndex: 'beginDate',
    width: 220,
    render: (value, record) => {
      return value && record?.endTime ? `${value} 至 ${record.endTime}` : '-';
    },
  },
  {
    title: '获取时间',
    dataIndex: 'submitTime',
    width: 220,
  },
];
